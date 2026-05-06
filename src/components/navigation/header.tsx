import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react";

interface Link {
    title: string
    url: string
}

interface HeaderMenu {
    topLink: Link
    links?: Link[]
}

interface Props {
    topTitle?: string
    image: string
    menu?: HeaderMenu[]
}

export default function Header({ topTitle, image, menu }: Props) {
    const [isScrolled, setIsScrolled] = useState(false)
    const [openDropdown, setOpenDropdown] = useState<number | null>(null)
    const [isMobile, setIsMobile] = useState(false)
    const [showMobileHeader, setShowMobileHeader] = useState(false)
    const [lastScrollY, setLastScrollY] = useState(0)

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY

            setIsScrolled(currentScrollY > 50)

            if (isMobile) {
                if (currentScrollY > 50) {
                    if (currentScrollY > lastScrollY) {
                        setShowMobileHeader(false)
                    } else {
                        setShowMobileHeader(true)
                    }
                } else {
                    setShowMobileHeader(false)
                }
            }

            setLastScrollY(currentScrollY)
        }

        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768)
        }

        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement
            if (!target.closest('[data-dropdown]')) {
                setOpenDropdown(null)
            }
        }

        checkMobile()
        window.addEventListener("scroll", handleScroll)
        window.addEventListener("resize", checkMobile)
        window.addEventListener("click", handleClickOutside)
        return () => {
            window.removeEventListener("scroll", handleScroll)
            window.removeEventListener("resize", checkMobile)
            window.removeEventListener("click", handleClickOutside)
        }
    }, [isMobile, lastScrollY])

    const handleDropdownToggle = (index: number) => {
        setOpenDropdown(openDropdown === index ? null : index)
    }

    return (
        <>
            <header className="relative w-full z-40">
                <div className="bg-(--light-blue-color)">
                    <div className="w-11/12 md:w-2/3 mx-auto py-4 flex flex-col items-center">
                        {topTitle && (
                            <h1 className="text-white text-lg font-bold mb-3 text-center">
                                {topTitle}
                            </h1>
                        )}
                        <img
                            src={image}
                            alt="Logo"
                            className="h-16 md:h-20 object-contain"
                        />
                    </div>
                </div>

                <div className="bg-white shadow-sm">
                    <div className="w-11/12 md:w-2/3 mx-auto">
                        <nav className="flex items-center justify-center py-3">
                            {menu && menu.length > 0 && (
                                <ul className="grid grid-cols-2 md:flex gap-4 md:gap-8 list-none m-0 p-0">
                                {menu.map((item, index) => (
                                    <li
                                        key={index}
                                        className="relative flex justify-center md:block"
                                        onMouseEnter={() => !isMobile && item.links && item.links.length > 0 && setOpenDropdown(index)}
                                        onMouseLeave={() => !isMobile && setOpenDropdown(null)}
                                    >
                                        {item.links && item.links.length > 0 ? (
                                            <div data-dropdown>
                                                <button
                                                    onClick={() => isMobile ? handleDropdownToggle(index) : window.location.href = item.topLink.url}
                                                    className="text-(--text-color) text-base md:text-lg font-semibold hover:text-(--blue-color) transition-colors flex items-center gap-1 no-underline bg-transparent border-none cursor-pointer p-0"
                                                >
                                                    {item.topLink.title}
                                                    <svg
                                                        className={`w-4 h-4 transition-transform ${openDropdown === index ? "rotate-180" : ""}`}
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </button>
                                                <AnimatePresence>
                                                    {openDropdown === index && (
                                                        <motion.ul
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, y: -10 }}
                                                            transition={{ duration: 0.2 }}
                                                            className="absolute top-full left-1/2 md:left-0 -translate-x-1/2 md:translate-x-0 mt-2 bg-white shadow-lg rounded-md min-w-[200px] md:min-w-50 list-none m-0 p-2 z-50 border border-(--thin-color)"
                                                        >
                                                            {item.links.map((link, linkIndex) => (
                                                                <li key={linkIndex}>
                                                                    <a
                                                                        href={link.url}
                                                                        className="block px-4 py-3 md:py-2 text-(--text-color) text-base hover:bg-(--xx-thin-color) rounded no-underline transition-colors"
                                                                    >
                                                                        {link.title}
                                                                    </a>
                                                                </li>
                                                            ))}
                                                        </motion.ul>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        ) : (
                                            <a
                                                href={item.topLink.url}
                                                className="text-(--text-color) text-base md:text-lg font-semibold hover:text-(--blue-color) transition-colors no-underline"
                                            >
                                                {item.topLink.title}
                                            </a>
                                        )}
                                    </li>
                                ))}
                                </ul>
                            )}
                        </nav>
                    </div>
                </div>
            </header>

            <AnimatePresence>
                {isScrolled && (
                    <motion.div
                        initial={{ y: -100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -100, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="hidden md:block fixed top-0 left-0 right-0 z-50 bg-white shadow-md"
                    >
                        <div className="w-11/12 md:w-2/3 mx-auto">
                            <nav className="flex items-center justify-between py-3">
                                <img
                                    src={image}
                                    alt="Logo"
                                    className="h-12 object-contain"
                                />

                                {menu && menu.length > 0 && (
                                    <ul className="flex gap-8 list-none m-0 p-0">
                                        {menu.map((item, index) => (
                                            <li
                                                key={index}
                                                className="relative"
                                                onMouseEnter={() => item.links && item.links.length > 0 && setOpenDropdown(index)}
                                                onMouseLeave={() => setOpenDropdown(null)}
                                            >
                                                {item.links && item.links.length > 0 ? (
                                                    <div data-dropdown>
                                                        <a
                                                            href={item.topLink.url}
                                                            className="text-(--text-color) text-lg font-semibold hover:text-(--blue-color) transition-colors flex items-center gap-1 no-underline"
                                                        >
                                                            {item.topLink.title}
                                                            <svg
                                                                className={`w-4 h-4 transition-transform ${openDropdown === index ? "rotate-180" : ""}`}
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                            </svg>
                                                        </a>
                                                        <AnimatePresence>
                                                            {openDropdown === index && (
                                                                <motion.ul
                                                                    initial={{ opacity: 0, y: -10 }}
                                                                    animate={{ opacity: 1, y: 0 }}
                                                                    exit={{ opacity: 0, y: -10 }}
                                                                    transition={{ duration: 0.2 }}
                                                                    className="absolute top-full left-0 mt-2 bg-white shadow-lg rounded-md min-w-50 list-none m-0 p-2 z-50 border border-(--thin-color)"
                                                                >
                                                                    {item.links.map((link, linkIndex) => (
                                                                        <li key={linkIndex}>
                                                                            <a
                                                                                href={link.url}
                                                                                className="block px-4 py-2 text-(--text-color) text-base hover:bg-(--xx-thin-color) rounded no-underline transition-colors"
                                                                            >
                                                                                {link.title}
                                                                            </a>
                                                                        </li>
                                                                    ))}
                                                                </motion.ul>
                                                            )}
                                                        </AnimatePresence>
                                                    </div>
                                                ) : (
                                                    <a
                                                        href={item.topLink.url}
                                                        className="text-(--text-color) text-lg font-semibold hover:text-(--blue-color) transition-colors no-underline"
                                                    >
                                                        {item.topLink.title}
                                                    </a>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </nav>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showMobileHeader && isMobile && (
                    <motion.div
                        initial={{ y: -100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -100, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="md:hidden fixed top-0 left-0 right-0 z-50 bg-(--light-blue-color) shadow-md"
                    >
                        <div className="w-full flex items-center justify-center py-3">
                            <img
                                src={image}
                                alt="Logo"
                                className="h-12 object-contain"
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
