'use client'

const RoleModal = ({ 
  isOpen, 
  onClose, 
  onSignup, 
  onSignin 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-lg p-8 relative border border-gray-800">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Join Us</h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white transition-colors text-xl focus:outline-none"
          >
            ✕
          </button>
        </div>

        <p className="mt-2 text-sm text-gray-300">
          Choose how you'd like to join our platform.
        </p>

        <div className="mt-6 flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4">
            <button 
              onClick={() => onSignup('brand')}
              className="flex-1 bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Join As Brand
            </button>
            <button 
              onClick={() => onSignup('influencer')}
              className="flex-1 border border-primary  text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Join As Influencer
            </button>
          </div>
          
          <div className="relative flex items-center py-4">
            <div className="flex-grow border-t border-gray-700"></div>
            <span className="flex-shrink mx-4 text-gray-400 text-sm">OR</span>
            <div className="flex-grow border-t border-gray-700"></div>
          </div>
          <div className="mt-4 text-center text-sm text-gray-400">
            Already have an account?{' '}
            <button 
              onClick={onSignin}
              className="text-primary hover:text-primary-light font-medium"
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleModal;