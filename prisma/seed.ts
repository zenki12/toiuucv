// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed FAQs
  await prisma.adminFaq.createMany({
    data: [
      {
        qVi: 'Tôi có cần trả phí không?',
        aVi: 'Không. Tối Ưu CV hoàn toàn miễn phí với 10 phân tích mỗi tháng cho mỗi tài khoản Google.',
        qEn: 'Do I need to pay?',
        aEn: 'No. CV Optimizer is completely free with 10 analyses per month per Google account.',
        displayOrder: 1,
      },
      {
        qVi: 'Dữ liệu CV của tôi có bị lưu trữ không?',
        aVi: 'File CV/JD được lưu trên server private và tự động xóa sau 90 ngày. Chúng tôi không chia sẻ dữ liệu với bên thứ ba.',
        qEn: 'Is my CV data stored?',
        aEn: 'CV/JD files are stored on private servers and automatically deleted after 90 days. We do not share data with third parties.',
        displayOrder: 2,
      },
      {
        qVi: 'Điểm số được tính như thế nào?',
        aVi: 'Điểm được tính theo 10 tiêu chí có trọng số, bao gồm mức độ phù hợp với JD, kinh nghiệm, kỹ năng, ATS format, và nhiều tiêu chí khác. Không sử dụng AI trả phí.',
        qEn: 'How is the score calculated?',
        aEn: 'Scored across 10 weighted criteria including JD relevance, experience, skills, ATS formatting, and more. No paid AI used.',
        displayOrder: 3,
      },
      {
        qVi: 'JD Fit Gap Map là gì?',
        aVi: 'Bảng phân tích từng yêu cầu trong JD: FOUND (CV đã có), PARTIAL (có một phần), MISSING (còn thiếu), kèm gợi ý cụ thể để bổ sung vào đúng vị trí.',
        qEn: 'What is the JD Fit Gap Map?',
        aEn: 'A table analyzing each JD requirement: FOUND (CV has it), PARTIAL (partially covered), MISSING (not present), with specific suggestions on where to add content.',
        displayOrder: 4,
      },
      {
        qVi: 'Hỗ trợ định dạng file nào?',
        aVi: 'PDF và DOCX (Word). Kích thước tối đa 100MB. Khuyến nghị dùng PDF để có kết quả trích xuất chính xác nhất.',
        qEn: 'What file formats are supported?',
        aEn: 'PDF and DOCX (Word). Maximum 100MB. PDF recommended for the most accurate text extraction.',
        displayOrder: 5,
      },
    ],
    skipDuplicates: true,
  });

  // Seed Testimonials
  await prisma.adminTestimonial.createMany({
    data: [
      {
        name: 'Nguyễn Minh Tuấn',
        titleVi: 'Software Engineer tại VNG Corporation',
        titleEn: 'Software Engineer at VNG Corporation',
        quoteVi: 'Nhờ JD Fit Gap Map, tôi phát hiện ra mình thiếu 5 từ khóa quan trọng mà JD yêu cầu. Sau khi tối ưu theo gợi ý, tôi được phỏng vấn trong vòng 1 tuần.',
        quoteEn: "Thanks to the JD Fit Gap Map, I discovered I was missing 5 important keywords the JD required. After optimizing per the suggestions, I got an interview within a week.",
        displayOrder: 1,
      },
      {
        name: 'Trần Thị Hương',
        titleVi: 'Product Manager tại Tiki',
        titleEn: 'Product Manager at Tiki',
        quoteVi: 'Optimization Lab rất hữu ích! Lời khuyên chi tiết theo từng mục giúp tôi biết chính xác cần sửa gì, không phải đoán mò như trước.',
        quoteEn: 'The Optimization Lab is incredibly useful! The detailed advice per section helped me know exactly what to fix, no more guessing.',
        displayOrder: 2,
      },
      {
        name: 'Lê Hoàng Phúc',
        titleVi: 'Data Analyst tại MoMo',
        titleEn: 'Data Analyst at MoMo',
        quoteVi: 'Điểm ATS của tôi từ 45 lên 78 chỉ sau 1 lần tối ưu. Công cụ miễn phí nhưng chất lượng không thua kém các dịch vụ trả phí nước ngoài.',
        quoteEn: 'My ATS score went from 45 to 78 after just one optimization session. Free tool but quality comparable to paid foreign services.',
        displayOrder: 3,
      },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Seed completed: FAQs and Testimonials added');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
