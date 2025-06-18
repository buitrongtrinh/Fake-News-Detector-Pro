import { firebaseAdmin } from "./services/firebase.service";

async function setAdminRole(uid: string) {
  try {
    await firebaseAdmin.auth().setCustomUserClaims(uid, { role: 'admin' });
    console.log(`Đã set role admin cho user: ${uid}`);
    process.exit(0);
  } catch (error) {
    console.error('Lỗi khi set admin role:', error);
    process.exit(1);
  }
}

// Thay uid này bằng uid thực tế của user bạn muốn làm admin
const adminUid = 'gPYAjl1V60eZpu1nq6F2fXSscm43';

setAdminRole(adminUid);
console.log('Khởi tạo admin thành công');
