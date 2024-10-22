import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import RecentPostPreviewList from '@/components/home/RecentPostPreviewList';
import Image from 'next/image';

export default function BlogHomepage() {
  const categories = ['Technology', 'Travel', 'Food', 'Lifestyle', 'Health'];
  const authors = [
    { name: 'Alice Johnson', avatar: '' },
    { name: 'Bob Smith', avatar: '' },
    { name: 'Carol Williams', avatar: '' },
  ];
  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <section className="mb-16 text-center">
          <h2 className="text-4xl font-extrabold mb-4">Welcome to XBlog</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Discover amazing stories, share your thoughts, and connect with
            fellow writers.
          </p>
          <Button size="lg" asChild>
            <Link href="/create-post">Start Writing</Link>
          </Button>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h3 className="text-2xl font-bold mb-4">Recent Posts</h3>
              <div className="space-y-6">
                <RecentPostPreviewList />
              </div>
            </section>

            <section>
              <h3 className="text-2xl font-bold mb-4">Featured Posts</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[1, 2].map((i) => (
                  <Card key={i} className='overflow-hidden'>
                    <CardHeader className='p-0'>
                      <div className="relative w-full min-h-60 overflow-hidden bg-purple-300">
                        <Image
                          src="/medium-thumbnail.png"
                          alt={`Featured post ${i}`}
                          fill
                          className="object-cover w-full h-full transition-opacity group-hover:opacity-80"
                        />
                      </div>
                      <CardTitle className="mt-4 p-2">
                        Featured Post Title {i}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className='p-2'>
                      <CardDescription>
                        An intriguing description of this featured post to
                        capture readers attention...
                      </CardDescription>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" asChild>
                        <Link href={`/featured/${i}`}>Read Featured Post</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-8">
            <section>
              <h3 className="text-2xl font-bold mb-4">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Badge key={category} variant="secondary">
                    <Link href={`/category/${category.toLowerCase()}`}>
                      {category}
                    </Link>
                  </Badge>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-2xl font-bold mb-4">Popular Posts</h3>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      <CardTitle className="text-base">
                        Popular Post Title {i}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>
                        A short teaser for this popular post...
                      </CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-2xl font-bold mb-4">Featured Authors</h3>
              <div className="space-y-4">
                {authors.map((author) => (
                  <div
                    key={author.name}
                    className="flex items-center space-x-4"
                  >
                    <Avatar>
                      <AvatarImage src={author.avatar} alt={author.name} />
                      <AvatarFallback>
                        {author.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{author.name}</p>
                      <Link
                        href={`/author/${author.name
                          .toLowerCase()
                          .replace(' ', '-')}`}
                        className="text-sm text-muted-foreground hover:underline"
                      >
                        View Profile
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-2xl font-bold mb-4">Newsletter</h3>
              <Card>
                <CardHeader>
                  <CardTitle>Stay Updated</CardTitle>
                  <CardDescription>
                    Subscribe to our newsletter for the latest posts and
                    updates.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <Input type="email" placeholder="Enter your email" />
                    <Button type="submit" className="w-full">
                      Subscribe
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </section>
          </div>
        </div>
      </main>

      <footer className="bg-muted mt-16 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-muted-foreground">
            © 2023 XBlog. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
