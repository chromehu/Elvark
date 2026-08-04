import { PageContainer } from '@/components/shared/PageContainer';
import { HeroSection } from '@/components/home/HeroSection';
import { CategoryShortcuts } from '@/components/home/CategoryShortcuts';
import { FeaturedCourses } from '@/components/home/FeaturedCourses';
import { UpcomingLiveClasses } from '@/components/home/UpcomingLiveClasses';
import { HowItWorks } from '@/components/home/HowItWorks';
import { InstructorRecruitment } from '@/components/home/InstructorRecruitment';
import { TrustStats } from '@/components/home/TrustStats';

export default function Home() {
  return (
    <PageContainer>
      <HeroSection />
      <CategoryShortcuts />
      <FeaturedCourses />
      <UpcomingLiveClasses />
      <HowItWorks />
      <InstructorRecruitment />
      <TrustStats />
    </PageContainer>
  );
}
