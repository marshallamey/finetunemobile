import React from 'react';


export default function LogoutButton() {
   return (
      <div>
         <p>Logged in as</p>
         <a href='/logout'> 
            <Button outline>
              <img 
                className="spotify-logo" 
                src="/img/spotify-logo.png" 
                alt="spotify-logo.JPG" 
              />
              Logout
            </Button> 
         </a>
      </div>
   );
 }