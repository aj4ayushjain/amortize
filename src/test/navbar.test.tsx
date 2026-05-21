import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Navbar from '@/components/ui/Navbar'

function renderNavbar() {
  return render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>
  )
}

describe('Navbar', () => {
  it('renders the site name', () => {
    renderNavbar()
    expect(screen.getByText('Amortization.in')).toBeInTheDocument()
  })

  it('renders Home and Blog links', () => {
    renderNavbar()
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Blog' })).toBeInTheDocument()
  })

  it('site name links to /', () => {
    renderNavbar()
    expect(screen.getByRole('link', { name: 'Amortization.in' })).toHaveAttribute('href', '/')
  })

  it('Home link points to /', () => {
    renderNavbar()
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/')
  })

  it('Blog link points to /blog', () => {
    renderNavbar()
    expect(screen.getByRole('link', { name: 'Blog' })).toHaveAttribute('href', '/blog')
  })

  it('renders a nav element with main navigation label', () => {
    renderNavbar()
    expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument()
  })

  it('nav is fixed to the top via CSS classes', () => {
    renderNavbar()
    const nav = screen.getByRole('navigation')
    expect(nav).toHaveClass('fixed')
    expect(nav).toHaveClass('top-0')
    expect(nav).toHaveClass('w-full')
  })

  it('inner container uses max-w-7xl to match original layout width', () => {
    renderNavbar()
    const nav = screen.getByRole('navigation')
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const inner = nav.querySelector('.max-w-7xl')
    expect(inner).not.toBeNull()
  })
})

describe('Navbar layout and CSS classes', () => {
  describe('nav element', () => {
    it('has background and border classes', () => {
      renderNavbar()
      const nav = screen.getByRole('navigation')
      expect(nav).toHaveClass('bg-white')
      expect(nav).toHaveClass('border-b')
    })

    it('has stacking order class z-50', () => {
      renderNavbar()
      expect(screen.getByRole('navigation')).toHaveClass('z-50')
    })
  })

  describe('inner container', () => {
    it('has horizontal centering and responsive padding classes', () => {
      renderNavbar()
      const nav = screen.getByRole('navigation')
      const container = nav.querySelector('.max-w-7xl')
      expect(container).toHaveClass('mx-auto')
      expect(container).toHaveClass('px-4')
      expect(container).toHaveClass('sm:px-6')
      expect(container).toHaveClass('lg:px-8')
    })
  })

  describe('flex row', () => {
    it('uses flex justify-between for left/right split layout', () => {
      renderNavbar()
      const nav = screen.getByRole('navigation')
      const flexRow = nav.querySelector('.flex.justify-between')
      expect(flexRow).not.toBeNull()
      expect(flexRow).toHaveClass('flex')
      expect(flexRow).toHaveClass('justify-between')
    })

    it('has fixed height h-16', () => {
      renderNavbar()
      const nav = screen.getByRole('navigation')
      const flexRow = nav.querySelector('.h-16')
      expect(flexRow).not.toBeNull()
    })
  })

  describe('brand section', () => {
    it('uses flex items-center for vertical centering', () => {
      renderNavbar()
      const brandLink = screen.getByRole('link', { name: 'Amortization.in' })
      const brandContainer = brandLink.parentElement
      expect(brandContainer).toHaveClass('flex')
      expect(brandContainer).toHaveClass('items-center')
    })

    it('brand link has bold typography and gray color classes', () => {
      renderNavbar()
      const brandLink = screen.getByRole('link', { name: 'Amortization.in' })
      expect(brandLink).toHaveClass('font-bold')
      expect(brandLink).toHaveClass('text-gray-900')
      expect(brandLink).toHaveClass('hover:text-gray-700')
    })

    it('brand link has responsive text size classes', () => {
      renderNavbar()
      const brandLink = screen.getByRole('link', { name: 'Amortization.in' })
      expect(brandLink).toHaveClass('text-base')
      expect(brandLink).toHaveClass('sm:text-xl')
    })

    it('brand link has no-underline and transition classes', () => {
      renderNavbar()
      const brandLink = screen.getByRole('link', { name: 'Amortization.in' })
      expect(brandLink).toHaveClass('no-underline')
      expect(brandLink).toHaveClass('transition-colors')
    })
  })

  describe('nav links section', () => {
    it('uses flex items-center for vertical alignment', () => {
      renderNavbar()
      const homeLink = screen.getByRole('link', { name: 'Home' })
      const linksContainer = homeLink.parentElement
      expect(linksContainer).toHaveClass('flex')
      expect(linksContainer).toHaveClass('items-center')
    })

    it('uses space-x-6 for horizontal spacing between links', () => {
      renderNavbar()
      const homeLink = screen.getByRole('link', { name: 'Home' })
      const linksContainer = homeLink.parentElement
      expect(linksContainer).toHaveClass('space-x-6')
    })

    it('nav links have muted color with dark hover', () => {
      renderNavbar()
      for (const name of ['Home', 'Blog']) {
        const link = screen.getByRole('link', { name })
        expect(link).toHaveClass('text-gray-600')
        expect(link).toHaveClass('hover:text-gray-900')
      }
    })

    it('nav links have responsive text size classes', () => {
      renderNavbar()
      for (const name of ['Home', 'Blog']) {
        const link = screen.getByRole('link', { name })
        expect(link).toHaveClass('text-sm')
        expect(link).toHaveClass('sm:text-base')
      }
    })

    it('nav links have no-underline and transition classes', () => {
      renderNavbar()
      for (const name of ['Home', 'Blog']) {
        const link = screen.getByRole('link', { name })
        expect(link).toHaveClass('no-underline')
        expect(link).toHaveClass('decoration-transparent')
        expect(link).toHaveClass('transition-colors')
      }
    })
  })
})
