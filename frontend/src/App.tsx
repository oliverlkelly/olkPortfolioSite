import { usePortfolioData }    from '@/hooks/usePortfolioData';
import { Nav }                  from '@/components/Nav';
import { Hero }                 from '@/components/Hero';
import { Stats }                from '@/components/Stats';
import { Projects }             from '@/components/Projects';
import { Experience }           from '@/components/Experience';
import { Education }            from '@/components/Education';
import { Footer }               from '@/components/Footer';
import { Skeleton, ErrorState } from '@/components/Skeleton';
import { ScrollProgress }       from '@/components/ScrollProgress';
import { CustomCursor }         from '@/components/CustomCursor';

export default function App() {
  const { data, loading, error } = usePortfolioData();

  if (loading) return <Skeleton />;
  if (error)   return <ErrorState message={error} />;

  return (
    <>
      <CustomCursor />
      <ScrollProgress />
      <Nav profile={data.profile} />

      <main>
        <Hero       profile={data.profile} />
        <Stats
          profile={data.profile}
          experience={data.experience}
          projects={data.projects}
        />
        <Projects   projects={data.projects} />
        <Experience experience={data.experience} />
        <Education  education={data.education} />
      </main>

      <Footer profile={data.profile} />
    </>
  );
}
