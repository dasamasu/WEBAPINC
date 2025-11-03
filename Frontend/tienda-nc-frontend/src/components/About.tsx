
import { motion } from 'framer-motion';
import { Tilt } from 'react-tilt';
import { fadeIn, textVariant } from '../utils/motion';
import styles from '../styles';

// Datos de ejemplo para los servicios
const services = [
  {
    title: "Web Development",
    icon: "https://via.placeholder.com/64",
  },
  {
    title: "Mobile Development", 
    icon: "https://via.placeholder.com/64",
  },
  {
    title: "Backend Development",
    icon: "https://via.placeholder.com/64",
  },
  {
    title: "UI/UX Design",
    icon: "https://via.placeholder.com/64",
  },
];

// Componente ServiceCard
const ServiceCard = ({ index, title, icon }: { index: number; title: string; icon: string }) => {
  return (
    <Tilt 
      className="xs:w-[250px] w-full"
      options={{ max: 45, scale: 1, speed: 450 }}
    >
      <motion.div  
        variants={fadeIn("right", "spring", index * 0.5, 0.75) as any} 
        initial="hidden"
        animate="show"
        className='w-full green-pink-gradient p-[1px] rounded-[20px] shadow-card'
      >
        <div className='bg-tertiary rounded-[20px] py-5 px-12 min-h-[280px] flex justify-evenly items-center flex-col'>
          <img src={icon} alt={title} className='w-16 h-16 object-contain' />
          <h3 className='text-white text-[20px] font-bold text-center'>{title}</h3>
        </div>
      </motion.div>
    </Tilt>
  );
};

const About = () => {
  return (
    <>
      <motion.div 
        variants={textVariant(0.1) as any} 
        initial="hidden"
        animate="show"
        className="mt-12"
      >
        <p className={styles.sectionSubText}>Introduction</p>
        <h2 className={styles.sectionHeadText}>Overview.</h2>
      </motion.div>

      <motion.p
        variants={fadeIn("up", "tween", 0.1, 1) as any}
        initial="hidden"
        animate="show"
        className="mt-4 text-secondary text-[17px] max-w-3xl leading-[30px]"
      >
        I'm a skilled software engineer with a passion for creating innovative solutions. 
        With expertise in web development, I excel in building responsive and user-friendly applications. 
        My experience includes working with various technologies and frameworks, allowing me to adapt to different project requirements. 
        I thrive in collaborative environments, where I can contribute my problem-solving skills and attention to detail. 
        I am committed to continuous learning and staying up-to-date with industry trends. 
        Let's connect and explore how I can help bring your ideas to life!
      </motion.p>

      <div className="mt-20 flex flex-wrap gap-10">
        {services.map((service, index) => (
          <ServiceCard key={service.title} index={index} {...service} />
        ))}
      </div>
    </>
  );
}

export default About;