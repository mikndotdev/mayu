import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Drawer } from "vaul";

declare global {
  interface Window {
    PagefindUI: any;
  }
}

interface Props {}

export default function MobileMenu({}: Props) {
  const [showMenu, setShowMenu] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [contentHtml, setContentHtml] = useState("");

  useEffect(() => {
    const sidebarContent = document.getElementById("mobile-sidebar-content");
    if (sidebarContent) {
      setContentHtml(sidebarContent.innerHTML);
    }
  }, []);

  useEffect(() => {
    if (isDrawerOpen && contentHtml) {
      const timer = setTimeout(() => {
        if (window.PagefindUI) {
          const searchElements = document.querySelectorAll(".pagefind-modal");
          searchElements.forEach((el) => {
            if (el && !el.hasAttribute("data-pagefind-initialized")) {
              new window.PagefindUI({
                element: el,
                showImages: false,
                pageSize: 3,
              });
              el.setAttribute("data-pagefind-initialized", "true");
            }
          });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isDrawerOpen, contentHtml]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (isMobile && !isDrawerOpen) {
        if (currentScrollY > 50) {
          if (currentScrollY > lastScrollY) {
            setShowMenu(false);
          } else {
            setShowMenu(true);
          }
        } else {
          setShowMenu(false);
        }
      }

      setLastScrollY(currentScrollY);
    };

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", checkMobile);
    };
  }, [isMobile, lastScrollY, isDrawerOpen]);

  return (
    <AnimatePresence>
      {(showMenu || isDrawerOpen) && isMobile && (
        <Drawer.Root open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-(--light-blue-color) shadow-lg"
          >
            <div className="w-full flex items-center justify-center py-4">
              <Drawer.Trigger asChild>
                <button className="px-6 py-2 bg-white text-(--text-color) font-semibold rounded-(--basic-border-radius) shadow-md hover:bg-gray-100 transition-colors">
                  メニュー
                </button>
              </Drawer.Trigger>
            </div>
          </motion.div>

          <Drawer.Portal>
            <Drawer.Overlay className="fixed inset-0 bg-black/40 z-40" />
            <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-[10px] max-h-[85vh] overflow-hidden flex flex-col">
              <div className="shrink-0 mx-auto w-12 h-1.5 bg-gray-300 rounded-full mt-4 mb-2" />
              <div
                className="overflow-y-auto flex-1"
                dangerouslySetInnerHTML={{ __html: contentHtml }}
              />
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>
      )}
    </AnimatePresence>
  );
}
