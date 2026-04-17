import fs from 'fs';
import path from 'path';
import Image from 'next/image';
import Link from 'next/link';

export default async function DirectorsPage() {
  const directorsDir = path.join(process.cwd(), 'public', 'directors');
  
  let images: string[] = [];
  try {
    if (fs.existsSync(directorsDir)) {
      const files = fs.readdirSync(directorsDir);
      images = files.filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
      });
    }
  } catch (error) {
    console.error('Error reading directors directory:', error);
  }

  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
         <Link href="/" className="text-indigo-400 hover:text-indigo-300 font-medium inline-flex items-center">
           <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
           </svg>
           Back to Home
         </Link>
      </div>
      
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 mb-4 tracking-tight drop-shadow-lg">
          Directors Gallery
        </h1>
        <p className="text-lg text-white/80 drop-shadow-sm max-w-2xl mx-auto">
          A collection of memories from our incredible directors.
        </p>
      </div>

      {images.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center backdrop-blur-sm">
          <p className="text-white/60 mb-4 text-xl">No pictures found yet.</p>
          <div className="bg-indigo-500/20 text-indigo-200 border border-indigo-500/30 rounded-lg p-6 inline-block text-left">
            <h3 className="font-semibold mb-2 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              How to add pictures:
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Open the <code className="bg-black/30 px-2 py-1 rounded">public/directors</code> folder in your project</li>
              <li>Paste your 15 pictures inside that folder</li>
              <li>Refresh this page</li>
            </ol>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((image, index) => (
            <div 
              key={index} 
              className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-white/5 border border-white/10 shadow-xl transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/20 hover:-translate-y-1"
            >
              <img
                src={`/directors/${image}`}
                alt={`Director view ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
