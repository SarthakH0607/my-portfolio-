
        {loading ? (
          <div className="flex items-center justify-center h-48 w-full">
            <div className="text-center">
              <motion.div
                className="w-10 h-10 rounded-full mx-auto mb-4"
                style={{ border: '2px solid rgba(107, 138, 253, 0.2)', borderTopColor: '#6b8afd' }}
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
              <p style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
                Initializing data sync...
              </p>
            </div>
          </div>
        ) : stats ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {/* Energy Reactor */}
            <motion.div
              className="lg:col-span-1"