import Header from '@/components/header/header';
import Logo from '@/components/logo/logo';
import SideNav from '@/components/sidenav/sidenav';

type Props = {
  children: React.ReactNode;
};

const MainLayout = (props: Props) => {
  const { children } = props;

  return (
    <div className='flex w-full h-screen max-h-screen max-w-full overflow-hidden'>
      <nav className='w-1/6 flex-shrink-0 h-full bg-gray-100'>
        <Logo />
        <SideNav />
      </nav>
      <main className='flex-grow'>
        <Header />
        <section className='p-4'>
            {children}
        </section>
      </main>
    </div>
  );
};

export default MainLayout;
