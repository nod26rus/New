import { render, screen } from '@testing-library/react'
import { PostCard } from '@/components/post-card'

const mockPost = {
  id: '1',
  title: 'Test Post',
  excerpt: 'Test excerpt',
  featuredImage: 'https://example.com/image.jpg',
  slug: 'test-post',
  author: {
    name: 'Test Author'
  },
  createdAt: new Date().toISOString(),
  tags: [
    { id: '1', name: 'Test Tag', slug: 'test-tag' }
  ]
}

describe('PostCard', () => {
  it('renders post information correctly', () => {
    render(<PostCard post={mockPost} />)
    
    expect(screen.getByText(mockPost.title)).toBeInTheDocument()
    expect(screen.getByText(mockPost.excerpt)).toBeInTheDocument()
    expect(screen.getByText('#' + mockPost.tags[0].name)).toBeInTheDocument()
    expect(screen.getByText(mockPost.author.name)).toBeInTheDocument()
  })

  it('renders default author name when author is null', () => {
    const postWithoutAuthor = {
      ...mockPost,
      author: { name: null }
    }
    
    render(<PostCard post={postWithoutAuthor} />)
    expect(screen.getByText('Аноним')).toBeInTheDocument()
  })
})