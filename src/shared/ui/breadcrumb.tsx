// src/shared/ui/breadcrumb.tsx
import { Link, useLocation } from '@tanstack/react-router';
import { ChevronRight } from 'lucide-react';

// ================= TYPES =================
type BreadcrumbItem = {
  label: string;
  href: string;
};

// ================= LOGIC =================
/**
 * Breadcrumb navigation component
 * @returns {JSX.Element} Breadcrumb component
 */
export const Breadcrumb = () => {
  const location = useLocation();

  const pathMap: Record<string, string> = {
    '': 'Dashboard',
    articles: 'Artikel',
    team: 'Team',
    locations: 'Standorte',
    login: 'Anmeldung',
    new: 'Neu',
    edit: 'Bearbeiten',
  };

  const generateBreadcrumbs = (): Array<BreadcrumbItem> => {
    const pathSegments = location.pathname.split('/').filter(Boolean);

    const breadcrumbs: Array<BreadcrumbItem> = [{ label: 'Dashboard', href: '/' }];

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;

      // Handle dynamic segments (IDs)
      let label = pathMap[segment] || segment;

      // Spezielle Behandlung für IDs
      if (segment.match(/^[0-9a-f-]+$/i)) {
        const previousSegment = pathSegments[index - 1];
        if (previousSegment === 'locations') {
          label = 'Standort-Details';
        } else if (previousSegment === 'team') {
          label = 'Mitarbeiter-Details';
        } else if (previousSegment === 'articles') {
          label = 'Artikel-Details';
        }
      }

      breadcrumbs.push({ label, href: currentPath });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // ================= RETURN =================
  return (
    <nav className="flex items-center space-x-1 text-sm">
      {breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1;

        return (
          <div key={crumb.href} className="flex items-center">
            {index > 0 && <ChevronRight className="mx-1 h-4 w-4 text-gray-400" />}
            {isLast ? (
              <span className="font-medium text-gray-900">{crumb.label}</span>
            ) : (
              <Link to={crumb.href} className="text-gray-500 transition-colors hover:text-gray-700">
                {crumb.label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
};
