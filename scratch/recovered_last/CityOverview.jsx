        className="text-center mb-12"
        initial={{ opacity: 0, y: 30 }}
 
        




















            }}
            initial={{ opacity: 0, y: 30 }}
            animate={hasBeenInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 * i }}
            whileHover={{ scale: 1.05, borderColor: district.color }}
          >
            <div className="text-3xl mb-3">{district.icon}</div>