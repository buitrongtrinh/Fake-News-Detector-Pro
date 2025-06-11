import express, { NextFunction, Request, Response } from 'express';
import authRouter from './routes/auth.routes';  // router dùng controller login
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

// Không cần khởi tạo lại admin ở đây vì đã làm trong services/firebase.ts

app.use('/api/auth', authRouter);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Lỗi server:', err);
  res.status(500).json({ message: 'Lỗi server nội bộ' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server chạy port ${PORT}`);
});
