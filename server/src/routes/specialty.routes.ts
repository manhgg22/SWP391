import express from 'express';
const router = express.Router();

// Ví dụ: lấy danh sách chuyên khoa
router.get('/', async (req, res) => {
  // Lấy dữ liệu từ DB
  // const specialties = await Specialty.find();
  res.json([]); // Trả về mảng rỗng hoặc dữ liệu thật
});

export const specialtyRouter = router;
