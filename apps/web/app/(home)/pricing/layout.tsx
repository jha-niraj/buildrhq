import Navbar from '@/components/landingpage/homepagenavbar';
import Footer from '@/components/landingpage/footer';

interface LayoutProps {
    children: React.ReactNode
}

const Layout = ({ children }: LayoutProps) => {
    return (
        <div className="flex flex-col bg-white dark:bg-neutral-950">
            <Navbar />
            {children}
            <Footer />
        </div>
    );
};

export default Layout;
