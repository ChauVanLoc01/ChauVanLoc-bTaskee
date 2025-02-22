import MainLayout from "@/layout/main-layout/main-layout";

type Props = {
  children: React.ReactNode;
};

const Layout = (props: Props) => {
  const { children } = props;

  return (
    <MainLayout>{children}</MainLayout>
  );
};

export default Layout;
