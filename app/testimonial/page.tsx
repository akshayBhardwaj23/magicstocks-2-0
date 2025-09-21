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
      role: "Software Engineer & Investor",
      location: "Bangalore, India",
      image: "/api/placeholder/60/60",
      rating: 5,
      content:
        "MagicStocks.ai has revolutionized my investment approach. The AI&apos;s analysis of Reliance Industries helped me identify a 25% gain opportunity I would have missed. The portfolio optimization suggestions are incredibly accurate.",
      highlight: "25% gain on Reliance Industries",
      verified: true,
      broker: "Zerodha",
    },
    {
      name: "Priya Sharma",
      role: "Financial Advisor",
      location: "Mumbai, India",
      image: "/api/placeholder/60/60",
      rating: 5,
      content:
        "As a financial advisor, I use MagicStocks.ai to provide better insights to my clients. The AI&apos;s fundamental analysis is thorough and the risk assessment features help me create more balanced portfolios.",
      highlight: "Improved client portfolio performance by 18%",
      verified: true,
      broker: "Upstox",
    },
    {
      name: "Arjun Patel",
      role: "Day Trader",
      location: "Delhi, India",
      image: "/api/placeholder/60/60",
      rating: 5,
      content:
        "The real-time analysis and market sentiment tracking have been game-changers for my day trading. The AI alerts me to market shifts before they become obvious, giving me a significant edge.",
      highlight: "40% improvement in day trading profits",
      verified: true,
      broker: "Zerodha",
    },
    {
      name: "Sneha Reddy",
      role: "Business Owner",
      location: "Hyderabad, India",
      image: "/api/placeholder/60/60",
      rating: 5,
      content:
        "I was new to stock investing when I started using MagicStocks.ai. The AI&apos;s explanations are so clear and educational. It&apos;s like having a personal financial advisor available 24/7. My portfolio has grown 35% in 6 months.",
      highlight: "35% portfolio growth in 6 months",
      verified: true,
      broker: "Upstox",
    },
    {
      name: "Vikram Singh",
      role: "Retired Banker",
      location: "Chennai, India",
      image: "/api/placeholder/60/60",
      rating: 5,
      content:
        "After retirement, I needed a reliable way to manage my investments. MagicStocks.ai&apos;s conservative analysis approach and risk management features give me confidence in my investment decisions.",
      highlight: "Stable 12% annual returns",
      verified: true,
      broker: "Zerodha",
    },
    {
      name: "Meera Joshi",
      role: "IT Professional",
      location: "Pune, India",
      image: "/api/placeholder/60/60",
      rating: 5,
      content:
        "The sector analysis and market trends predictions are incredibly accurate. I&apos;ve been able to diversify my portfolio effectively and avoid several market downturns thanks to the AI&apos;s early warnings.",
      highlight: "Avoided 3 major market corrections",
      verified: true,
      broker: "Upstox",
    },
  ];

  const stats = [
    { icon: Users, label: "Active Users", value: "10,000+" },
    { icon: TrendingUp, label: "Average Returns", value: "18.5%" },
    { icon: Shield, label: "Data Security", value: "100%" },
    { icon: Zap, label: "Response Time", value: "< 2s" },
  ];

  const features = [
    {
      icon: Target,
      title: "Accurate Predictions",
      description: "Our AI achieves 78% accuracy in stock price predictions",
    },
    {
      icon: TrendingUp,
      title: "Portfolio Growth",
      description: "Users see average portfolio growth of 18.5% annually",
    },
    {
      icon: Shield,
      title: "Risk Management",
      description: "Advanced risk assessment helps protect investments",
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
          Join thousands of successful investors who have transformed their
          investment strategies with MagicStocks.ai&apos;s AI-powered insights.
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
            Ready to Transform Your Investment Strategy?
          </h2>
          <p className="text-lg text-muted-foreground mb-6">
            Join thousands of successful investors who trust MagicStocks.ai for
            their investment decisions.
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">
                Start Free Trial
              </div>
              <div className="text-sm text-muted-foreground">
                Get 10 free credits to explore
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">
                No Credit Card Required
              </div>
              <div className="text-sm text-muted-foreground">
                Start investing smarter today
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trust Indicators */}
      <div className="mt-16 text-center">
        <h3 className="text-xl font-semibold text-foreground mb-6">
          Trusted by Investors Across India
        </h3>
        <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
          <div className="text-sm font-medium">Zerodha Integration</div>
          <div className="text-sm font-medium">Upstox Integration</div>
          <div className="text-sm font-medium">Bank-Level Security</div>
          <div className="text-sm font-medium">24/7 AI Support</div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialPage;
