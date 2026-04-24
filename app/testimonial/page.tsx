"use client";

import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, TrendingUp, Shield, Zap, Target, Users } from "lucide-react";

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
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
          What Our Users Say
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          How people use MagicStocks for research and learning. Not
          performance claims; individual results vary. Not investment advice.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-4 bg-card rounded-lg border"
            >
              <stat.icon className="h-8 w-8 mx-auto text-primary mb-2" />
              <div className="text-2xl font-bold text-foreground">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {testimonials.map((testimonial, index) => (
          <Card
            key={index}
            className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary"
          >
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={testimonial.image}
                      alt={testimonial.name}
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {testimonial.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {testimonial.location}
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {testimonial.broker}
                </Badge>
              </div>

              <div className="flex items-center space-x-1 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
                {testimonial.verified && (
                  <Badge variant="outline" className="ml-2 text-xs">
                    Verified
                  </Badge>
                )}
              </div>

              <div className="bg-primary/10 p-3 rounded-lg">
                <p className="text-sm font-semibold text-primary">
                  {testimonial.highlight}
                </p>
              </div>
            </CardHeader>

            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                &ldquo;{testimonial.content}&rdquo;
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Features Highlight */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center text-foreground mb-12">
          Why Users Choose MagicStocks.ai
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="text-center hover:shadow-md transition-shadow"
            >
              <CardHeader>
                <feature.icon className="h-12 w-12 mx-auto text-primary mb-4" />
                <h3 className="text-xl font-semibold text-foreground">
                  {feature.title}
                </h3>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <Card className="text-center bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardHeader>
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Explore markets on your terms
          </h2>
          <p className="text-lg text-muted-foreground mb-6">
            Sign in to use credits for AI-assisted learning. We do not provide
            SEBI-regulated investment advice.
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">Credits</div>
              <div className="text-sm text-muted-foreground">
                Pay per use—see current offers on Plans
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">
                Your research
              </div>
              <div className="text-sm text-muted-foreground">
                We help you read and learn—not decide for you
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
  );
};

export default TestimonialPage;
