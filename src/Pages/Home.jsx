import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Phone, MapPin, AlertTriangle, Eye, Calendar, Search, Award, Users, Clock, CheckCircle2, Package, AlertCircle, Clipboard } from 'lucide-react';
import { cn } from '@/lib/utils';
import Meteors from "@/components/ui/meteors";
import { AnimatedList } from '@/components/ui/animated-list';
import { Link } from 'react-router-dom';
import { ImageCarousel } from '@/components/ImageCarousel';
import Particles from '@/components/ui/particles';

const HeroSection = () => {
  const features = [
    {
      icon: <Search className="h-6 w-6" />,
      title: "Quick Search",
      description: "Find lost items or missing persons efficiently"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Real-time Updates",
      description: "Get instant notifications on matches"
    },
    {
      icon: <AlertCircle className="h-6 w-6" />,
      title: "24/7 Support",
      description: "Round-the-clock assistance during Mahakumbh"
    }
  ];

  return (
    <div className="relative h-screen flex items-center justify-center bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      <Meteors number={30} />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="container mx-auto px-4 relative z-10"
      >
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-block mb-4 px-4 py-1 rounded-full bg-white/10 backdrop-blur-sm"
            >
              <span className="text-sm font-medium">Kumbh Connect Lost & Found Service</span>
            </motion.div>
            
            <motion.h1
              className="text-6xl p-3 font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Reuniting People at
              <br /> महाकुम्भ 2025
            </motion.h1>
            
            <motion.p
              className="text-xl mb-8 text-gray-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Our advanced lost and found system helps pilgrims find their loved ones
              and belongings during the sacred gathering at Prayagraj.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-4 justify-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Link to="/report/person">
                <Button size="lg" className="bg-white text-gray-900 hover:bg-slate-400">
                  Report Missing Person
                  <Clipboard className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/menu">
                <Button size="lg" className="bg-white text-gray-900 hover:bg-slate-400">
                  View Listings
                  <AlertCircle className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="grid md:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.2 }}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
              >
                <div className="bg-white/10 rounded-lg p-3 inline-block mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
    </div>
  );
};

const HomePage = ({ className }) => {
  const images = [
    "https://cdnbbsr.s3waas.gov.in/s3cd4bb35c75ba84b4f39e547b1416fd35/uploads/2021/07/2021071340.jpg",
    "https://cdnbbsr.s3waas.gov.in/s3cd4bb35c75ba84b4f39e547b1416fd35/uploads/2021/07/2021071384.jpg",
    "https://cdnbbsr.s3waas.gov.in/s3cd4bb35c75ba84b4f39e547b1416fd35/uploads/2021/07/2021071323.jpg",
    "https://cdnbbsr.s3waas.gov.in/s3cd4bb35c75ba84b4f39e547b1416fd35/uploads/2021/07/2021071393-1024x683.jpg",
    "https://cdnbbsr.s3waas.gov.in/s3cd4bb35c75ba84b4f39e547b1416fd35/uploads/2021/07/2021071343.jpg",
    "https://cdn.pixabay.com/photo/2021/02/26/16/51/india-6052517_1280.jpg",
    "https://cdn.pixabay.com/photo/2019/03/18/17/07/pragraj-4063557_1280.jpg",
    "https://cdn.pixabay.com/photo/2021/01/17/10/43/ganges-5924565_1280.jpg",
    "https://cdn.pixabay.com/photo/2023/06/10/05/28/ganga-pooja-8053190_1280.jpg"
  ];

  const missingPersons = [
    {
      name: "Ramesh Kumar",
      age: 65,
      location: "Triveni Sangam",
      lastSeen: "2024-03-15 14:30",
      description: "Elderly man wearing orange dhoti and kurta, speaks Hindi",
      priority: "HIGH",
      image: "/api/placeholder/64/64"
    },
    {
      name: "Priya Singh",
      age: 28,
      location: "Sector 4 Camp",
      lastSeen: "2024-03-16 09:15",
      description: "Young woman in blue saree, carrying a small bag",
      priority: "HIGH",
      image: "/api/placeholder/64/64"
    },
    {
      name: "Arjun Patel",
      age: 45,
      location: "Ram Ghat",
      lastSeen: "2024-03-16 11:30",
      description: "Middle-aged man in white kurta, wearing glasses",
      priority: "MEDIUM",
      image: "/api/placeholder/64/64"
    }
  ];

  const foundItems = [
    {
      name: "Gold Bracelet",
      location: "Near Akshardham Temple",
      description: "Valuable gold bracelet found on the ground",
      icon: "💍",
      color: "#1E86FF",
      time: "2024-05-20 10:00",
    },
    {
      name: "Blue Backpack",
      location: "Sector 9",
      description: "Backpack containing personal belongings found on a bench",
      icon: "🎒",
      color: "#1E86FF",
      time: "2024-06-15 14:30",
    },
    {
      name: "Blue Backpack",
      location: "Sector 9",
      description: "Backpack containing personal belongings found on a bench",
      icon: "🎒",
      color: "#1E86FF",
      time: "2024-06-15 14:30",
    },
    {
      name: "Blue Backpack",
      location: "Sector 9",
      description: "Backpack containing personal belongings found on a bench",
      icon: "🎒",
      color: "#1E86FF",
      time: "2024-06-15 14:30",
    },
    {
      name: "Blue Backpack",
      location: "Sector 9",
      description: "Backpack containing personal belongings found on a bench",
      icon: "🎒",
      color: "#1E86FF",
      time: "2024-06-15 14:30",
    },
    {
      name: "Blue Backpack",
      location: "Sector 9",
      description: "Backpack containing personal belongings found on a bench",
      icon: "🎒",
      color: "#1E86FF",
      time: "2024-06-15 14:30",
    },
  ];

  const achievements = [
    {
      title: "Lost Persons Reunited",
      value: "5000+",
      icon: Users,
      description: "Successfully reunited families during previous Kumbh events"
    },
    {
      title: "Lost Items Recovered",
      value: "50,000+",
      icon: Package,
      description: "Trained personnel ensuring safety of pilgrims"
    },
    {
      title: "Response Time",
      value: "15 min",
      icon: Clock,
      description: "Average emergency response time across the Mela grounds"
    },
    {
      title: "Success Rate",
      value: "99.9%",
      icon: CheckCircle2,
      description: "In resolving lost and found cases"
    }
  ];

  const whyChooseUs = [
    {
      title: "24/7 Emergency Support",
      description: "Round-the-clock assistance with multilingual support team",
      icon: Phone
    },
    {
      title: "Advanced Search System",
      description: "AI-powered matching system for quick identification",
      icon: Search
    },
    {
      title: "Experienced Team",
      description: "Dedicated team with decades of Kumbh management experience",
      icon: Award
    }
  ];

  const Notification = ({ name, description, icon, color, time }) => {
    return (
      <motion.figure
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "relative mx-auto min-h-fit w-full max-w-[400px] cursor-pointer overflow-hidden rounded-2xl p-4",
          "transition-all duration-300 ease-out",
          "hover:scale-[102%] hover:shadow-lg",
          "bg-white/95 backdrop-blur-sm",
          "border border-gray-100",
          "[box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05)]",
          "dark:bg-gray-800/90 dark:border-gray-700/50",
          "transform-gpu"
        )}
      >
        <div className="flex flex-row items-center gap-4">
          <div
            className={cn(
              "flex size-12 items-center justify-center rounded-xl",
              "transition-transform duration-300 group-hover:scale-110",
              "shadow-sm"
            )}
            style={{
              backgroundColor: color,
            }}
          >
            <span className="text-xl text-white">{icon}</span>
          </div>
          <div className="flex flex-col flex-1 overflow-hidden min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-base font-semibold text-gray-900 dark:text-white truncate">
                {name}
              </span>
              <span className="text-gray-400 dark:text-gray-500">·</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                {time}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
              {description}
            </p>
          </div>
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />
        
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </motion.figure>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Meteors */}
      <HeroSection />


      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">About Mahakumbh Festival</h2>
          <p className="text-gray-600">The world's largest spiritual gathering, celebrating centuries of tradition and faith.</p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Sacred Tradition</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Mahakumbh occurs every 12 years at the confluence of three holy rivers - Ganga, Yamuna, and Saraswati. It represents the nectar of immortality from Hindu mythology.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Spiritual Significance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Millions of devotees gather for sacred baths at auspicious dates, seeking spiritual purification and liberation from the cycle of birth and death.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Cultural Heritage</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Experience ancient traditions, religious discourses, cultural performances, and the gathering of saints and seers from across India.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Image Gallery */}
      <div className="relative container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Mahakumbh Gallery</h2>
        <p className="text-gray-600">Experience the divine atmosphere through our curated collection of images</p>
      </motion.div>
      <ImageCarousel images={images} />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white -z-10" />
    </div>

    {/* Mahakumbh Details Section */}
      <div className="relative  container mx-auto overflow-hidden">
      <Particles
        className="absolute inset-0"
        quantity={100}
        ease={80}
        color={"#000000"}
        refresh
      />
      
      <div className="container relative mx-auto px-4 py-16 z-10">
        <div className="text-center mb-12">
          <h2 className="text-6xl font-bold mb-4 bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text text-transparent">
            Mahakumbh 2025
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join millions in the sacred gathering at Prayagraj
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="bg-background/80 backdrop-blur-sm border-muted">
            <CardHeader>
              <CardTitle className="text-2xl">About Mahakumbh 2025</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                The Mahakumbh is a sacred Hindu festival that takes place every 12 years in Prayagraj, Uttar Pradesh, India. The next Mahakumbh is scheduled to be held in 2025, where millions of pilgrims are expected to gather for the auspicious event.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="w-4 h-4 mr-2" />
                  Prayagraj, Uttar Pradesh
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="w-4 h-4 mr-2" />
                  January - March 2025
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-background/80 backdrop-blur-sm border-muted">
            <CardHeader>
              <CardTitle className="text-2xl">Lost & Found Application</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Our dedicated application helps reunite lost individuals and recover misplaced items during the Mahakumbh gathering. Report missing persons or found items, and we'll assist in connecting you with the rightful owners.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Link to="/report/person">
                  <Button
                    variant="outline"
                    className="hover:bg-primary/10"
                  >
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Report Missing Person
                  </Button>
                </Link>
                <Link to="/report/item">
                  <Button
                    variant="outline"
                    className="hover:bg-primary/10"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Report Found Item
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>

      {/* Missing Persons Details */}
      <section className="container mx-auto px-4 py-16 bg-gray-50">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Priority Missing Persons</h2>
          <p className="text-gray-600">Please help us locate these individuals. Contact emergency helpline if found.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {missingPersons.map((person, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="space-y-0 pb-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={person.image} alt={person.name} />
                    <AvatarFallback>{person.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-xl">{person.name}</CardTitle>
                    <p className="text-sm text-gray-500">Age: {person.age}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Badge variant={person.priority === 'HIGH' ? 'destructive' : 'secondary'}>
                    {person.priority} PRIORITY
                  </Badge>
                  <p className="text-sm text-gray-600">{person.description}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
                    Last seen: {person.lastSeen} at {person.location}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Found Items Section */}
      <div
        className={cn(
          "relative flex h-[500px] mx-auto container flex-col p-6 overflow-hidden rounded-lg border bg-background md:shadow-xl",
          className
        )}
      >
       <h2 className="text-3xl font-bold text-gray-900 mb-2">Recent Lost/Found Items</h2>
       <p className="text-gray-600 mb-5">Kindly Collect Your Lost Belongings from our Centers.</p>
        <AnimatedList>
          {foundItems.map((item, idx) => (
            <Notification {...item} key={idx} />
          ))}
        </AnimatedList>
      </div>

      {/* Why Choose Us Section */}
      <section className="container mx-auto px-4 py-16 bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Our Services</h2>
          <p className="text-gray-600">Dedicated to ensuring your safety and peace of mind during the Mahakumbh festival.</p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-8">
          {whyChooseUs.map((item, index) => (
            <Card key={index} className="text-center">
              <CardContent className="pt-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Emergency Contact */}
      <div className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-to-r from-gray-700 to-gray-600 text-white p-8 overflow-hidden relative">
            <CardContent className="relative z-10">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="mb-6 md:mb-0">
                  <h3 className="text-2xl font-bold mb-2">Emergency Helpline</h3>
                  <p className="text-gray-200">Available 24/7 for immediate assistance</p>
                </div>
                <Button className="bg-white text-gray-700 hover:bg-gray-100">
                  <Phone className="w-4 h-4 mr-2" />
                  1800-XXX-XXXX
                </Button>
              </div>
            </CardContent>
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-gray-500 to-transparent" />
          </Card>
        </div>
      </div>
      
      {/* Achievements Section */}
      <section className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Our Achievements</h2>
            <p className="text-gray-300">Making a difference in pilgrim safety and support</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <Card key={index} className="bg-gray-800 border-gray-700">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                      <achievement.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold mb-2 text-white">{achievement.value}</h3>
                    <p className="text-lg font-semibold mb-2 text-slate-200">{achievement.title}</p>
                    <p className="text-gray-400 text-sm">{achievement.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>



      {/* Footer */}
      <footer className="bg-gray-800 text-white pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">Mahakumbh</h3>
              <p className="text-gray-400">Explore the vibrant and spiritual Mahakumbh gathering in Prayagraj.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Home</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Gallery</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Emergency</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">FAQs</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Emergency Contact</h4>
              <div className="space-y-4">
                <p className="text-gray-400">24/7 Helpline:</p>
                <Button className="w-full bg-white text-gray-700 hover:bg-gray-100">
                  <Phone className="mr-2 h-4 w-4" />
                  1800-XXX-XXXX
                </Button>
              </div>
            </div>
          </div>
          <div className="text-center text-gray-400 text-sm">
            © 2024 Mahakumbh. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;