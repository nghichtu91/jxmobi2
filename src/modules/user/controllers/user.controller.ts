import {
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  HttpStatus,
  Body,
  HttpException,
  Res,
  Logger,
} from '@nestjs/common';
import { UserService } from '../services';
import { JwtAuth, User, ReqUser, AppPermissionBuilder } from '@shared';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ChangePassWordDTO } from '../dtos';
import { Response } from 'express';
import { AppResources } from '@config';
import { InjectRolesBuilder, RolesBuilder } from 'nest-access-control';
import { HttpStatusCode } from 'axios';
import { IUserReponseDto, UserReponseDto } from '../dtos/userReponse.dto';

@Controller('user')
@ApiTags('User')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(
    private readonly userService: UserService,
    @InjectRolesBuilder()
    private readonly rolesBuilder: RolesBuilder,
  ) {}

  @JwtAuth()
  @Get('me')
  @ApiOperation({ summary: 'Lấy thông tin tài khoản' })
  @ApiOkResponse({
    description: 'Lấy thành công thông tin tài khoản.',
    type: UserReponseDto,
  })
  @ApiForbiddenResponse({
    description: 'Không có quyền truy cập.',
  })
  @ApiNotFoundResponse({
    description: 'Không tìm thấy tài khoản này.',
  })
  async getUserById(@User() currentUser: ReqUser): Promise<IUserReponseDto> {
    const permission = new AppPermissionBuilder()
      .setRolesBuilder(this.rolesBuilder)
      .setRequestUser(currentUser)
      .setAction('read')
      .setResourceName(AppResources.USER)
      .setCreatorId(currentUser.id)
      .build()
      .grant();
    if (!permission.granted) {
      throw new HttpException(``, HttpStatusCode.Forbidden);
    }
    const userEntity = await this.userService.getUser(currentUser.username);
    const { userName, fullName, phone, roles, id, ktcoin, isNew } =
      new UserReponseDto(userEntity);
    return permission.filter({
      userName,
      fullName,
      phone,
      roles,
      id,
      ktcoin,
      isNew,
    });
  }

  @JwtAuth()
  @Get('menus')
  async userMenu(@User() currentUser: ReqUser) {
    const menus = [
      {
        code: 'dashboard',
        label: {
          zh_CN: 'Dashboard',
          en_US: 'Dashboard',
        },
        icon: 'dashboard',
        path: '/dashboard',
      },
      {
        code: 'user',
        label: {
          zh_CN: '组件',
          en_US: 'Thông tin tài khoản',
        },
        icon: 'account',
        path: '/user',
        children: [
          {
            code: 'user-info',
            label: {
              en_US: 'Thông tin tài khoản',
            },
            path: '/user/info',
          },
          {
            code: 'user-change-password',
            label: {
              zh_CN: 'Nạp thẻ',
              en_US: 'Đổi mật khẩu',
            },
            path: '/user/change-password',
          },
        ],
      },
      {
        code: 'payment',
        label: {
          zh_CN: '组件',
          en_US: 'Nạp thẻ',
        },
        icon: 'payment',
        path: '/payment',
        children: [
          {
            code: 'payment',
            label: {
              zh_CN: 'Nạp thẻ',
              en_US: 'Nạp thẻ',
            },
            path: '/payment',
          },
          {
            code: 'payment-histories',
            label: {
              zh_CN: 'Lịch sử nạp thẻ',
              en_US: 'Lịch sử nạp thẻ',
            },
            path: '/payment/histories',
          },
        ],
      },
    ];
    let h = [];
    const permission = new AppPermissionBuilder()
      .setRolesBuilder(this.rolesBuilder)
      .setRequestUser(currentUser)
      .setAction('read')
      .setAction('create')
      .setResourceName(AppResources.ADMIN)
      .setCreatorId(currentUser.id)
      .build()
      .grant();
    if (permission.granted) {
      h = [
        {
          code: 'admin',
          icon: 'account',
          label: {
            zh_CN: 'Admin',
            en_US: 'Admin',
          },
          path: '/admin',
          children: [
            {
              path: '/admin/users',
              label: {
                zh_CN: 'Admin',
                en_US: 'Danh sách tài khoản',
              },
            },
            {
              path: '/admin/payments',
              label: {
                zh_CN: 'Admin',
                en_US: 'Lịch sử nạp thẻ',
              },
            },
          ],
        },
      ].concat(h);
    }
    // user menus
    h = h.concat(menus);
    return {
      status: true,
      message: '',
      result: h,
    };
  }

  @Get('notice')
  notice() {
    return {
      status: true,
      message: '成功',
      result: [
        {
          id: '000000001',
          avatar:
            'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
          title: '你收到了 14 份新周报',
          datetime: '2017-08-09',
          type: 'notification',
        },
        {
          id: '000000002',
          avatar:
            'https://gw.alipayobjects.com/zos/rmsportal/OKJXDXrmkNshAMvwtvhu.png',
          title: '你推荐的 曲妮妮 已通过第三轮面试',
          datetime: '2017-08-08',
          type: 'notification',
        },
        {
          id: '000000003',
          avatar:
            'https://gw.alipayobjects.com/zos/rmsportal/kISTdvpyTAhtGxpovNWd.png',
          title: '这种模板可以区分多种通知类型',
          datetime: '2017-08-07',
          read: true,
          type: 'notification',
        },
        {
          id: '000000004',
          avatar:
            'https://gw.alipayobjects.com/zos/rmsportal/GvqBnKhFgObvnSGkDsje.png',
          title: '左侧图标用于区分不同的类型',
          datetime: '2017-08-07',
          type: 'notification',
        },
        {
          id: '000000005',
          avatar:
            'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
          title: '内容不要超过两行字，超出时自动截断',
          datetime: '2017-08-07',
          type: 'notification',
        },
        {
          id: '000000006',
          avatar:
            'https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg',
          title: '曲丽丽 评论了你',
          description: '描述信息描述信息描述信息',
          datetime: '2017-08-07',
          type: 'message',
          clickClose: true,
        },
        {
          id: '000000007',
          avatar:
            'https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg',
          title: '朱偏右 回复了你',
          description: '这种模板用于提醒谁与你发生了互动，左侧放『谁』的头像',
          datetime: '2017-08-07',
          type: 'message',
          clickClose: true,
        },
        {
          id: '000000008',
          avatar:
            'https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg',
          title: '标题',
          description: '这种模板用于提醒谁与你发生了互动，左侧放『谁』的头像',
          datetime: '2017-08-07',
          type: 'message',
          clickClose: true,
        },
        {
          id: '000000009',
          title: '任务名称',
          description: '任务需要在 2017-01-12 20:00 前启动',
          extra: '未开始',
          status: 'todo',
          type: 'event',
        },
        {
          id: '000000010',
          title: '第三方紧急代码变更',
          description:
            '冠霖提交于 2017-01-06，需在 2017-01-07 前完成代码变更任务',
          extra: '马上到期',
          status: 'urgent',
          type: 'event',
        },
        {
          id: '000000011',
          title: '信息安全考试',
          description: '指派竹尔于 2017-01-09 前完成更新并发布',
          extra: '已耗时 8 天',
          status: 'doing',
          type: 'event',
        },
        {
          id: '000000012',
          title: 'ABCD 版本发布',
          description:
            '冠霖提交于 2017-01-06，需在 2017-01-07 前完成代码变更任务',
          extra: '进行中',
          status: 'processing',
          type: 'event',
        },
      ],
    };
  }

  @JwtAuth()
  @Patch(':id/changepassword')
  @ApiOperation({ summary: 'Đổi mật khẩu tài khoản.' })
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiBadRequestResponse({
    description: 'Có lỗi trong quá trình cập nhật!',
  })
  @ApiUnauthorizedResponse({
    description: 'Chưa xác thực',
  })
  @ApiOkResponse({ description: 'Cập nhật thành công.' })
  @ApiParam({ name: 'id', description: 'sử dụng tài khoản' })
  async changePassWordUser(
    @Param('id') username: string,
    @Body() changePassworDto: ChangePassWordDTO,
    @User() currentUser: ReqUser,
    @Res() res: Response,
  ) {
    // kiểm tra tài khoản cần cập nhật
    if (username !== currentUser.username) {
      throw new HttpException(``, HttpStatus.NOT_MODIFIED);
    }
    const checkUser = await this.userService.findByUserName(username);
    if (!checkUser) {
      throw new HttpException(``, HttpStatus.NOT_FOUND);
    }

    try {
      await this.userService.changePassword(username, changePassworDto);
      this.logger.log(
        `[Changepassword tài khoản ${username} đổi thông tin thành công!`,
      );
      res.status(HttpStatus.OK).json({
        message: 'Cập nhật thông tin thành công!',
      });
    } catch (e) {
      const error = e as unknown as Error;
      this.logger.error(error.message);
      throw new HttpException(
        `Có lỗi trong quá trình cập nhật, vui lòng thử lại sau.`,
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
}
