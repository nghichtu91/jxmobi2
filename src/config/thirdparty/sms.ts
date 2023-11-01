export type SmsActions =
  | 'phonechange'
  | 'passwordchange'
  | 'secpasschange'
  | 'secretquestionchange'
  | 'unlockequipment'
  | 'forgotpass';

export const SmsServiceNumber = process.env.SMS_SERVICE_NUMBER || '8185';
export const SmsKeyPrimary = process.env.SMS_KEY_PRIMARY || 'ON';
export const SmsKeySub = process.env.SMS_KEY_SUB || 'PLV';
export const SmsHosts = process.env.SMS_HOSTS || '127.0.0.1|localhost';
export const SmsExpired = process.env.SMS_EXPIRED || 60; // Phút

export const SmsMsgFailed = process.env.SMS_MSG_FAILED || 'Co loi tu he thong.';
export const SmsMsgExpired =
  process.env.SMS_MSG_EXPIRED || 'Het hieu luc thao tac.';
export const SmsMsgNotFound =
  process.env.SMS_MSG_NOT_FOUND || 'Yeu cau khong ton tai.';
export const SmsMsgPhoneNotMatch =
  process.env.SMS_MSG_PHONE_NOT_MATCH ||
  'So dien thoai khong khop trong tai khoan.';

export const SmsMsgChangePhoneSuccessfully =
  process.env.SMS_MSG_CHANGE_PHONE || 'So dien thoai moi là: %s';
export const SmsMsgChangePassWordSuccessfully =
  process.env.SMS_MSG_CHANGE_PASSWORD || 'Mat khau game moi là: %s';
export const SmsMsgChangeSecPhoneSuccessfully =
  process.env.SMS_MSG_CHANGE_SEC_PHONE || 'Mat khau cap 2 moi là: %s';
export const SmsMsgUnlockEquipmentSuccessfully =
  process.env.SMS_MSG_UNLOCK_EQUIPMENT || 'Da mo khoa trang bi thanh cong.';
export const SmsMsgChangeSecretQuestionSuccessfully =
  process.env.SMS_MSG_CHANGE_SECRET_QUESTION ||
  'Doi cau hoi bi mat và ca tra loi thanh cong.';
