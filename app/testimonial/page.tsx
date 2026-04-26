"use client";

import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  TrendingUp,
  Shield,
  Zap,
  Target,
  Users,
  Sparkles,
} from "lucide-react";

const TestimonialPage = () => {
  const testimonials = [
    {
      name: "Rajesh Kumar",
      role: "Software engineer",
      location: "Bengaluru, India",
      image: "/api/placeholder/60/60",
      rating: 5,
      content:
        "I use it to read up on large caps before I dig into annual reports. The explanations are clear and it stays away from telling me what to buy—that matches how I work with my adviser.",
      highlight: "Faster research prep",
      verified: true,
      broker: "User",
    },
    {
      name: "Priya Sharma",
      role: "Chartered accountant",
      location: "Mumbai, India",
      image: "/api/placeholder/60/60",
      rating: 5,
      content:
        "Helpful for vocabulary and context on sectors and ratios. I still rely on SEBI-registered advisers for client portfolios, but this saves time on first-pass reading.",
      highlight: "Clearer fundamentals context",
      verified: true,
      broker: "User",
    },
    {
      name: "Arjun Patel",
      role: "Retail participant",
      location: "Delhi, India",
      image: "/api/placeholder/60/60",
      rating: 5,
      content:
        "I wanted plain-English notes on what news flow and sentiment talk about, without ‘tips’. The product positioning as education-first works for me.",
      highlight: "News and sentiment in one place",
      verified: true,
      broker: "User",
    },
    {
      name: "Sneha Reddy",
      role: "Business owner",
      location: "Hyderabad, India",
      image: "/api/placeholder/60/60",
      rating: 5,
      content:
        "As someone who was new to markets, I liked that it focuses on learning and data. I use it alongside courses and my own reading—not as a replacement for professional advice.",
      highlight: "Beginner-friendly framing",
      verified: true,
      broker: "User",
    },
    {
      name: "Vikram Singh",
      role: "Retired banker",
      location: "Chennai, India",
      image: "/api/placeholder/60/60",
      rating: 5,
      content:
        "The portfolio view helps me see weights and P&L in one screen. I treat the text as context only and discuss actions with my family adviser.",
      highlight: "Holdings snapshot + notes",
      verified: true,
      broker: "User",
    },
    {
      name: "Meera Joshi",
      role: "IT professional",
      location: "Pune, India",
      image: "/api/placeholder/60/60",
      rating: 5,
      content:
        "Sector overviews are useful for following themes without the app pushing trades. I appreciate the explicit not-advice disclaimers.",
      highlight: "Theme-level education",
      verified: true,
      broker: "User",
    },
  ];

  const stats = [
    { icon: Users, label: "Community", value: "Growing" },
    { icon: TrendingUp, label: "Focus", value: "Education" },
    { icon: Shield, label: "Encryption", value: "In transit" },
    { icon: Zap, label: "Typical reply", value: "Fast" },
  ];

  const features = [
    {
      icon: Target,
      title: "Information & education",
      description:
        "Explanations and data-oriented chat—not personalized buy or sell calls.",
    },
    {
      icon: TrendingUp,
      title: "India-first context",
      description:
        "NSE, BSE, and Indian market language where relevant, with source transparency.",
    },
    {
      icon: Shield,
      title: "You stay in control",
      description:
        "We highlight that we are not SEBI-registered; professional advice is your choice.",
    },
  ];

  return (
    <main className="relative">
      <div className="pointer-events-none absolute inset-0 -z-10 hero-spotlight" />

      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge
            variant="secondary"
            className="border-primary/20 bg-primary/10 text-primary"
          >
            <Sparkles className="mr-1 h-3.5 w-3.5" />
            Voices from our users
          </Badge>
          <h1 className="mt-4 font-display text-4xl sm:text-5xl font-semibold tracking-tight">
            Built for <span className="text-brand-gradient">curious</span> investors
          </h1>
          <p className="mt-4 text-muted-foreground">
            How people use MagicStocks for research and learning. Not
            performance claims; individual results vary. Not investment advice.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-4 surface-soft rounded-xl border"
            >
              <stat.icon className="h-7 w-7 mx-auto text-primary mb-2" />
              <div className="font-display text-xl font-semibold text-foreground">
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Main Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              interactive
              className="border-l-4 border-l-primary"
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={testimonial.image}
                        alt={testimonial.name}
                      />
                      <AvatarFallback className="bg-brand-gradient text-primary-foreground font-display">
                        {testimonial.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-foreground leading-tight">
                        {testimonial.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {testimonial.role} · {testimonial.location}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-[10px]">
                    {testimonial.broker}
                  </Badge>
                </div>

                <div className="flex items-center space-x-1 mb-2">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                  {testimonial.verified && (
                    <Badge variant="outline" className="ml-2 text-[10px]">
                      Verified
                    </Badge>
                  )}
                </div>

                <div className="bg-primary/10 px-3 py-2 rounded-lg">
                  <p className="text-xs font-medium text-primary">
                    {testimonial.highlight}
                  </p>
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  &ldquo;{testimonial.content}&rdquo;
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Highlight */}
        <div className="mb-16">
          <h2 className="font-display text-3xl font-semibold text-center text-foreground mb-10">
            Why people use MagicStocks.ai
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} interactive className="text-center surface-soft">
                <CardHeader>
                  <feature.icon className="h-10 w-10 mx-auto text-primary mb-3" />
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    {feature.title}
                  </h3>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <Card className="text-center surface-soft border-primary/20">
          <CardHeader>
            <h2 className="font-display text-3xl font-semibold text-foreground mb-3">
              Explore markets on your terms
            </h2>
            <p className="text-muted-foreground mb-2">
              Sign in to use credits for AI-assisted learning. We do not
              provide SEBI-regulated investment advice.
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <div className="text-center">
                <div className="font-display text-xl font-semibold text-foreground">
                  Credits
                </div>
                <div className="text-sm text-muted-foreground">
                  Pay per use — no expiry
                </div>
              </div>
              <div className="hidden sm:block h-8 w-px bg-border" />
              <div className="text-center">
                <div className="font-display text-xl font-semibold text-foreground">
                  Your research
                </div>
                <div className="text-sm text-muted-foreground">
                  We help you read and learn — not decide for you
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <h3 className="text-xl font-semibold text-foreground mb-6">
            Built for Indian market learners
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="text-sm font-medium">India-focused content</div>
            <div className="text-sm font-medium">Encrypted transport</div>
            <div className="text-sm font-medium">AI chat (non-advisory)</div>
            <div className="text-sm font-medium">Portfolio tools evolving</div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default TestimonialPage;
