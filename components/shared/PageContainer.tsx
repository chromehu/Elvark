import { Header } from './Header';
import { Footer } from './Footer';
import { DemoBanner } from './DemoBanner';

interface PageContainerProps {
  children: React.ReactNode;
  showFooter?: boolean;
}

export function PageContainer({ children, showFooter = true }: PageContainerProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <DemoBanner />
      <Header />
      <main className="flex-1">{children}</main>
      {showFooter && <Footer />}
    </div>
  );
}
