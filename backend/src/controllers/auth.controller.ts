import { Request, Response, NextFunction, RequestHandler } from 'express';
import { firebaseAdmin } from '../services/firebase';

export const login: RequestHandler = async (req, res) => {
  try {
    const idToken = req.headers.authorization?.split('Bearer ')[1];

    if (!idToken) {
      res.status(401).json({ message: 'Thiếu token xác thực' });
      return;
    }

    const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
    
    // Lấy role từ custom claims
    const role = decodedToken.role || 'user';

    console.log(role, 'đang sử dụng.');

    res.status(200).json({
      message: 'Xác thực thành công từ Firebase',
      displayName: decodedToken.name,
      email: decodedToken.email,
      name: decodedToken.name,
      uid: decodedToken.uid,
      role,
    });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Token không hợp lệ' });
  }
};
