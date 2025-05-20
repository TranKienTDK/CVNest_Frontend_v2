import React from "react";
import { motion } from "framer-motion";
import { Users, FileText, Briefcase, Building2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const StatisticItem = ({
  icon,
  value,
  label,
  delay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="flex flex-col items-center p-4"
    >
      <div className="mb-3 rounded-full bg-primary/10 p-3 text-primary">
        {icon}
      </div>
      <motion.h3
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: delay + 0.2 }}
        className="text-3xl font-bold mb-1"
      >
        {value}
      </motion.h3>
      <p className="text-muted-foreground text-center">{label}</p>
    </motion.div>
  );
};

const Testimonial = ({
  quote,
  author,
  position,
  delay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay }}
      className="flex-1"
    >
      <Card className="h-full bg-background">
        <CardContent className="p-6">
          <p className="italic text-muted-foreground mb-4">"{quote}"</p>
          <div>
            <p className="font-medium">{author}</p>
            <p className="text-sm text-muted-foreground">{position}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const StatisticsSection = () => {
  const statistics = [
    {
      icon: <Users size={24} />,
      value: "10,000+",
      label: "Successful Job Placements",
    },
    {
      icon: <FileText size={24} />,
      value: "50,000+",
      label: "CV Downloads",
    },
    {
      icon: <Briefcase size={24} />,
      value: "200+",
      label: "CV Templates",
    },
    {
      icon: <Building2 size={24} />,
      value: "5,000+",
      label: "Companies Hiring",
    },
  ];

  const testimonials = [
    {
      quote:
        "This platform helped me create a professional CV in minutes and I landed my dream job within two weeks!",
      author: "Sarah Johnson",
      position: "UX Designer at Google",
    },
    {
      quote:
        "The templates are modern and eye-catching. I received multiple interview calls after updating my CV here.",
      author: "Michael Chen",
      position: "Software Engineer at Microsoft",
    },
  ];

  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-2">Tác Động Của Chúng Tôi</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Chúng tôi đã giúp hàng nghìn người tìm việc 
            tạo ra các CV chuyên nghiệp và tìm được công việc mơ ước.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {statistics.map((stat, index) => (
            <StatisticItem
              key={index}
              icon={stat.icon}
              value={stat.value}
              label={stat.label}
              delay={index * 0.1}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mb-8"
        >
          <h3 className="text-2xl font-bold mb-2">Câu Chuyện Thành Công</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Nghe từ những người đã thay đổi sự nghiệp của họ nhờ nền tảng của chúng tôi.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => (
            <Testimonial
              key={index}
              quote={testimonial.quote}
              author={testimonial.author}
              position={testimonial.position}
              delay={0.5 + index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatisticsSection;