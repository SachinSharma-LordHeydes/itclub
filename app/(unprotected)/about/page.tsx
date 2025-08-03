import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Target, Globe, Lightbulb, Heart, Zap, BookOpen, Trophy, Briefcase, Network } from "lucide-react"

export default function AboutPage() {
  const values = [
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "We foster creative thinking and encourage members to push the boundaries of technology.",
    },
    {
      icon: Heart,
      title: "Community",
      description: "Building strong relationships and supporting each other's growth in the tech journey.",
    },
    {
      icon: Target,
      title: "Excellence",
      description: "Striving for the highest standards in everything we do, from projects to events.",
    },
    {
      icon: Globe,
      title: "Impact",
      description: "Creating meaningful solutions that benefit our community and society at large.",
    },
  ]

  const programs = [
    {
      icon: BookOpen,
      title: "Learning Workshops",
      description: "Regular hands-on workshops covering the latest technologies and industry best practices.",
      features: ["Weekly tech talks", "Hands-on coding sessions", "Industry expert speakers"],
    },
    {
      icon: Trophy,
      title: "Competitions",
      description: "Hackathons, coding challenges, and tech competitions to test and improve your skills.",
      features: ["Monthly hackathons", "Coding challenges", "Inter-college competitions"],
    },
    {
      icon: Briefcase,
      title: "Career Development",
      description: "Comprehensive support for internships, job placements, and career advancement.",
      features: ["Resume workshops", "Interview preparation", "Industry networking"],
    },
    {
      icon: Network,
      title: "Mentorship",
      description: "Connect with experienced professionals and senior students for guidance and support.",
      features: ["1-on-1 mentoring", "Career guidance", "Project collaboration"],
    },
  ]

  const achievements = [
    { number: "500+", label: "Active Members", description: "Growing community of tech enthusiasts" },
    { number: "50+", label: "Events Annually", description: "Workshops, hackathons, and seminars" },
    { number: "20+", label: "Industry Partners", description: "Leading tech companies and startups" },
    { number: "95%", label: "Job Placement", description: "Members successfully placed in tech roles" },
  ]

  const leadership = [
    {
      name: "Alex Chen",
      role: "President",
      description:
        "Computer Science senior with internship experience at Google. Passionate about AI and machine learning.",
    },
    {
      name: "Sarah Johnson",
      role: "Vice President",
      description: "Software Engineering major with expertise in full-stack development and open-source contributions.",
    },
    {
      name: "Mike Rodriguez",
      role: "Technical Lead",
      description: "Cybersecurity enthusiast with certifications in ethical hacking and network security.",
    },
    {
      name: "Emily Davis",
      role: "Events Coordinator",
      description: "Information Systems student with experience in project management and event planning.",
    },
  ]

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-blue-100 text-blue-700">About TechClub</Badge>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Empowering the Next Generation of
              <div className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 my-2">
                {" "}
                Tech Leaders    
              </div>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Founded in 2025, TechHub has grown into the premier technology club on campus, fostering innovation,
              collaboration, and career development for students passionate about technology.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <Card className="border-l-4 border-l-blue-600">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Target className="h-6 w-6 text-blue-600" />
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-lg leading-relaxed">
                  To create an inclusive environment where students can explore, learn, and excel in technology while
                  building meaningful connections with peers and industry professionals. We strive to bridge the gap
                  between academic learning and real-world application.
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-600">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Zap className="h-6 w-6 text-purple-600" />
                  Our Vision
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-lg leading-relaxed">
                  To be the leading technology community that produces innovative thinkers, skilled professionals, and
                  ethical leaders who will shape the future of technology and make a positive impact on society.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600">The principles that guide everything we do</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Our Programs</h2>
            <p className="text-xl text-gray-600">Comprehensive offerings to support your tech journey</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {programs.map((program, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <program.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    {program.title}
                  </CardTitle>
                  <CardDescription className="text-base">{program.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {program.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2 text-gray-600">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Our Achievements</h2>
            <p className="text-xl opacity-90">Numbers that reflect our impact and growth</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl lg:text-5xl font-bold mb-2">{achievement.number}</div>
                <div className="text-xl font-semibold mb-2">{achievement.label}</div>
                <div className="text-sm opacity-80">{achievement.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Leadership Team</h2>
            <p className="text-xl text-gray-600">Meet the passionate individuals leading TechClub</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {leadership.map((leader, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">
                      {leader.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-1">{leader.name}</h3>
                  <Badge className="mb-3 bg-blue-100 text-blue-700">{leader.role}</Badge>
                  <p className="text-gray-600 text-sm">{leader.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Ready to Join Our Community?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Become part of TechHub and start your journey towards becoming a technology leader.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="text-lg px-8">
              <Link href="/dashboard">Join TechClub</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
