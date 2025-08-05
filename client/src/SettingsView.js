// client/src/SettingsView.js

import React from 'react';
import { setDoc, doc } from 'firebase/firestore';
import { db } from './firebase';

// This is the simple component you designed.
// It receives all the data it needs as props.
function SettingsView({ user, categories }) {



        const handleDeleteCategory = async (categoryName) => {
        if (!window.confirm("Are you sure you want to delete this category?")) { 
            return;
        }
        try {
            const updatedCategories = categories.filter(category => category.name !== categoryName);
            const userDocRef = doc(db, 'users', user.uid);
            
            await setDoc(userDocRef, { categories: updatedCategories }, { merge: true });



        } catch (error) {
            console.error("Error deleting category:", error);
        }
    };

  return (
    <div className="bg-gray-800 text-white shadow-2xl p-8 w-full max-w-2xl mx-auto rounded-2xl">
      <h2 className="text-3xl font-bold mb-6">Settings</h2>
      
      <div>
        <h3 className="text-xl font-semibold mb-4">Manage Categories</h3>
        {categories.length > 0 ? (
          <ul className="space-y-3">
            {/* We use category.name for the key, as you designed. */}
            {categories.map((category) => (
              <li 
                key={category.name} 
                className="bg-gray-700 p-4 rounded-lg flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div 
                    className="w-6 h-6 rounded-full" 
                    style={{ backgroundColor: category.color }}
                  ></div>
                  <span className="font-semibold">{category.name}</span>
                </div>
                <button 
                  className="text-gray-400 hover:text-white transition-colors"
                  onClick={() => handleDeleteCategory(category.name)}
                >
                  <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.033-2.134H8.716c-1.123 0-2.033.954-2.033 2.134v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">You haven't created any categories yet.</p>
        )}
      </div>
    </div>
  );
};

export default SettingsView;