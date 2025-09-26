import { Link } from 'react-router-dom'

type Action = {
  label: string
  to: string
}

type PageHeroProps = {
  eyebrow?: string
  title: string
  description: string
  primaryAction?: Action
  secondaryAction?: Action
}

const PageHero = ({ eyebrow, title, description, primaryAction, secondaryAction }: PageHeroProps) => {
  return (
    <section className="bg-surface border border-border rounded-l p-10 space-y-6 shadow-light">
      {eyebrow && <span className="text-xs tracking-[0.3em] uppercase text-text-secondary">{eyebrow}</span>}
      <h1 className="text-4xl font-bold leading-tight">{title}</h1>
      <p className="text-lg text-text-secondary max-w-3xl leading-relaxed">{description}</p>

      {(primaryAction || secondaryAction) && (
        <div className="flex flex-wrap gap-3">
          {primaryAction && (
            <Link
              to={primaryAction.to}
              className="btn-primary inline-flex items-center justify-center px-6 py-3 text-sm rounded-m"
            >
              {primaryAction.label}
            </Link>
          )}
          {secondaryAction && (
            <Link
              to={secondaryAction.to}
              className="btn-secondary inline-flex items-center justify-center px-6 py-3 text-sm rounded-m"
            >
              {secondaryAction.label}
            </Link>
          )}
        </div>
      )}
    </section>
  )
}

export default PageHero

