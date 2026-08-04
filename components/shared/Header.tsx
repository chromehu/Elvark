'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronDown, Info, LogOut, User as UserIcon, Shield, GraduationCap } from 'lucide-react';
import { Logo } from './Logo';
import { useRole, roleLabels, type DemoRole } from '@/components/providers/RoleProvider';
import { useAuth } from '@/components/providers/AuthProvider';
import { DEMO_MODE } from '@/lib/config';

const navLinks = [
  { href: '/kurzusok', label: 'Kurzusok' },
  { href: '/elo-oktatasok', label: 'Élő oktatások' },
  { href: '/oktato-jelentkezes', label: 'Oktatóknak' },
];

const realRoleLabels: Record<string, string> = {
  student: 'Hallgató',
  instructor: 'Oktató',
  admin: 'Adminisztrátor',
};

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { role, setRole } = useRole();
  const { user, profile, loading, signOut } = useAuth();
  const [mounted, setMounted] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  // Close user menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (href: string) =>
    pathname === href || (href !== '/' && pathname.startsWith(href));

  const handleSignOut = async () => {
    await signOut();
    setUserMenuOpen(false);
    setMobileOpen(false);
    router.push('/');
  };

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : profile?.email?.[0]?.toUpperCase() || '?';

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" aria-label="ELVARK főoldal">
              <Logo size="md" />
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? 'text-navy-900 bg-navy-50'
                      : 'text-gray-600 hover:text-navy-900 hover:bg-navy-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            {/* Demo role selector — visual preview only, never changes real auth */}
            {mounted && DEMO_MODE && !user && (
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-navy-900 hover:bg-navy-50 transition-colors"
                  aria-label="Demó nézet választása"
                  aria-expanded={roleMenuOpen}
                  title="Ez a választó kizárólag a bemutató felületek megtekintésére szolgál."
                >
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium bg-cobalt-50 text-cobalt-600">
                    Demó
                  </span>
                  <span className="font-medium text-navy-900">{roleLabels[role]}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </button>
                {roleMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setRoleMenuOpen(false)}
                      aria-hidden="true"
                    />
                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-soft-lg border border-gray-100 py-1 z-20 animate-scale-in">
                      <div className="px-3 py-2">
                        <p className="text-xs text-gray-400 font-medium">Demó nézet</p>
                        <p className="text-xs text-gray-400 mt-1 flex items-start gap-1">
                          <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                          A demó nézet kizárólag a felületek megtekintésére szolgál, és nem módosítja a fiókod jogosultságait.
                        </p>
                      </div>
                      <div className="border-t border-gray-100">
                        {(Object.keys(roleLabels) as DemoRole[]).map((r) => (
                          <button
                            key={r}
                            onClick={() => {
                              setRole(r);
                              setRoleMenuOpen(false);
                            }}
                            className={`block w-full text-left px-3 py-2 text-sm transition-colors ${
                              role === r
                                ? 'text-cobalt-600 bg-cobalt-50 font-medium'
                                : 'text-gray-700 hover:bg-navy-50'
                            }`}
                          >
                            {roleLabels[r]}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Logged-out state */}
            {mounted && !loading && !user && (
              <>
                <Link
                  href="/belepes"
                  className="hidden sm:inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium text-navy-700 hover:bg-navy-50 transition-colors"
                >
                  Bejelentkezés
                </Link>
                <Link
                  href="/regisztracio"
                  className="hidden sm:inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium bg-cobalt-600 text-white hover:bg-cobalt-700 transition-colors shadow-soft"
                >
                  Regisztráció
                </Link>
              </>
            )}

            {/* Logged-in state */}
            {mounted && !loading && user && profile && (
              <div className="relative hidden sm:block" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-navy-50 transition-colors"
                  aria-label="Felhasználói menü"
                  aria-expanded={userMenuOpen}
                >
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-navy-100 flex items-center justify-center">
                      <span className="text-sm font-bold text-navy-700">{initials}</span>
                    </div>
                  )}
                  <div className="text-left">
                    <p className="text-sm font-medium text-navy-900 max-w-[120px] truncate">{profile.full_name || profile.email}</p>
                    <p className="text-xs text-gray-400">{realRoleLabels[profile.role] || 'Hallgató'}</p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-soft-lg border border-gray-100 py-1 z-20 animate-scale-in">
                    <Link
                      href="/fiokom"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-navy-50 transition-colors"
                    >
                      <UserIcon className="w-4 h-4" /> Fiókom
                    </Link>
                    {profile.role === 'instructor' && (
                      <Link
                        href="/oktato"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-navy-50 transition-colors"
                      >
                        <GraduationCap className="w-4 h-4" /> Oktatói felület
                      </Link>
                    )}
                    {profile.role === 'admin' && (
                      <Link
                        href="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-navy-50 transition-colors"
                      >
                        <Shield className="w-4 h-4" /> Adminisztráció
                      </Link>
                    )}
                    <div className="border-t border-gray-100">
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-navy-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Kijelentkezés
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Loading state */}
            {mounted && loading && (
              <div className="hidden sm:flex items-center gap-2 px-2 py-1.5">
                <div className="w-8 h-8 rounded-full bg-gray-100 animate-pulse" />
                <div className="w-20 h-4 rounded bg-gray-100 animate-pulse" />
              </div>
            )}

            <button
              className="md:hidden p-2 rounded-lg text-navy-700 hover:bg-navy-50 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menü megnyitása"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white animate-fade-in max-h-[calc(100vh-4rem)] overflow-y-auto" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
          <nav className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? 'text-navy-900 bg-navy-50'
                    : 'text-gray-600 hover:bg-navy-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {/* Demo selector on mobile — visual only */}
            {mounted && DEMO_MODE && !user && (
              <div className="border-t border-gray-100 pt-3 mt-3">
                <div className="px-3 py-2 text-xs text-gray-400 font-medium flex items-center gap-1.5">
                  <Info className="w-3 h-3" />
                  Demó nézet (csak megtekintés)
                </div>
                <div className="flex gap-2 px-1">
                  {(Object.keys(roleLabels) as DemoRole[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        setRole(r);
                        setMobileOpen(false);
                      }}
                      className={`flex-1 px-2 py-2 rounded-lg text-xs font-medium transition-colors ${
                        role === r
                          ? 'bg-cobalt-600 text-white'
                          : 'bg-navy-50 text-navy-700'
                      }`}
                    >
                      {roleLabels[r]}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="border-t border-gray-100 pt-3 mt-3 space-y-1">
              {mounted && !loading && !user && (
                <>
                  <Link
                    href="/belepes"
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2.5 rounded-lg text-sm font-medium text-navy-700 hover:bg-navy-50 transition-colors"
                  >
                    Bejelentkezés
                  </Link>
                  <Link
                    href="/regisztracio"
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2.5 rounded-lg text-sm font-medium bg-cobalt-600 text-white text-center hover:bg-cobalt-700 transition-colors"
                  >
                    Regisztráció
                  </Link>
                </>
              )}
              {mounted && !loading && user && profile && (
                <>
                  <div className="px-3 py-2 flex items-center gap-3">
                    {profile.avatar_url ? (
                      <img src={profile.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-navy-100 flex items-center justify-center">
                        <span className="text-sm font-bold text-navy-700">{initials}</span>
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-navy-900">{profile.full_name || profile.email}</p>
                      <p className="text-xs text-gray-400">{realRoleLabels[profile.role] || 'Hallgató'}</p>
                    </div>
                  </div>
                  <Link
                    href="/fiokom"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-navy-700 hover:bg-navy-50 transition-colors"
                  >
                    <UserIcon className="w-4 h-4" /> Fiókom
                  </Link>
                  {profile.role === 'instructor' && (
                    <Link
                      href="/oktato"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-navy-700 hover:bg-navy-50 transition-colors"
                    >
                      <GraduationCap className="w-4 h-4" /> Oktatói felület
                    </Link>
                  )}
                  {profile.role === 'admin' && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-navy-700 hover:bg-navy-50 transition-colors"
                    >
                      <Shield className="w-4 h-4" /> Adminisztráció
                    </Link>
                  )}
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-navy-700 hover:bg-navy-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> Kijelentkezés
                  </button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
