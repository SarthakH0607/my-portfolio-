      setFormState({ name: '', email: '', message: '' });
      setTimeout(() => setSent(false), 3000);
    }, 1500);
  };

  const socials = [
    {
      name: 'Website',
      icon: <FiGlobe size={20} />,
      href: 'https://sarthakhundare.syntacsyndicate.co.in',
      value: 'sarthakhundare.syntacsyndicate.co.in',
      color: '#00f0ff',
    },
    {
      name: 'Email',
      icon: <FiMail size={20} />,
      href: 'mailto:sarthakhundare@example.com',
      value: 'sarthakhundare@example.com',
      color: '#ec4899',
    },
    {
      name: 'GitHub',
      icon: <FiGithub size={20} />,
      href: 'https://github.com/sarthakhundare',
      value: 'github.com/sarthakhundare',
      color: '#10b981',
    },
    {
      name: 'LinkedIn',
      icon: <FiLinkedin size={20} />,
      href: '#',
      value: 'linkedin.com/in/sarthakhundare',
      color: '#3b82f6',
    },
  ];

  return (
    <section ref={ref} className="section-container" id="contact-district">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-12"