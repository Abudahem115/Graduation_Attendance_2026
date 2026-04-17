import fs from 'fs';
import path from 'path';
import { RegistrationForm } from '../components/RegistrationForm';
import { BackgroundSlider } from '../components/BackgroundSlider';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const directorsDir = path.join(process.cwd(), 'public', 'directors');
  let images: string[] = [];

  try {
    if (fs.existsSync(directorsDir)) {
      const files = fs.readdirSync(directorsDir);
      images = files
        .filter(file => {
          const ext = path.extname(file).toLowerCase();
          return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
        })
        .map(file => `/directors/${encodeURIComponent(file)}`);
    }
  } catch (error) {
    console.error('Error reading directors directory for background slider:', error);
  }

  // Fallback if no images found, we use the original campus background
  if (images.length === 0) {
    images = ['/campus-background.jpg'];
  }

  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center relative">
      <BackgroundSlider images={images} />
      
      <div className="w-full max-w-lg mb-8 text-center flex flex-col items-center relative z-10">
        <div className="mb-6 w-36 h-36 flex items-center justify-center">
          <img src="/logo.png" alt="University Logo" className="w-full h-full object-contain drop-shadow-2xl" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 mb-2 tracking-tight drop-shadow-lg">
          เข้าร่วมกิจกรรม
        </h1>
        <p className="text-lg text-white/80 drop-shadow-sm mb-6">
          ลงทะเบียนเข้าร่วมงานบายเนียร์ 
          ประจำปี 2569
        </p>
      </div>

      <div className="w-full max-w-lg flex justify-center relative z-10">
        <RegistrationForm />
      </div>
    </main>
  );
}
