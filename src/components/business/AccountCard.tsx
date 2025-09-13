import { Link } from 'react-router-dom'
import { Account } from '../../store/slices/accountsSlice'

interface AccountCardProps {
  account: Account
}

const AccountCard = ({ account }: AccountCardProps) => {
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  const handleFollow = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // TODO: 实现关注功能
    console.log('Follow account:', account.username)
  }

  return (
    <Link to={`/account/${account.id}`} className="block">
      <div className="card-base card-hover p-6 h-full">
        {/* Header */}
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center mr-4">
            {account.avatar ? (
              <img
                src={account.avatar}
                alt={account.displayName}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <span className="text-primary font-semibold text-lg">
                {account.displayName.charAt(0)}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-text-primary truncate">
                @{account.username}
              </h3>
              {account.verified && (
                <svg className="w-4 h-4 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <p className="text-text-secondary text-sm truncate">
              {account.bio}
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="text-text-primary text-sm leading-relaxed mb-4 text-truncate-3">
          {account.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {account.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="tag-base">
              {tag}
            </span>
          ))}
          {account.tags.length > 3 && (
            <span className="tag-base">
              +{account.tags.length - 3}
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4 text-center">
          <div>
            <div className="text-primary font-semibold text-sm">
              {formatNumber(account.followers)}
            </div>
            <div className="text-text-secondary text-xs">关注者</div>
          </div>
          <div>
            <div className="text-primary font-semibold text-sm">
              {formatNumber(account.tweets)}
            </div>
            <div className="text-text-secondary text-xs">推文</div>
          </div>
          <div>
            <div className="text-primary font-semibold text-sm">
              {account.activity}%
            </div>
            <div className="text-text-secondary text-xs">活跃度</div>
          </div>
        </div>

        {/* Follow Button */}
        <button
          onClick={handleFollow}
          className="btn-primary w-full"
        >
          关注账号
        </button>
      </div>
    </Link>
  )
}

export default AccountCard
