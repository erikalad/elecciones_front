import React, { useEffect } from 'react';
import Landing from './componentes/Landing';
import './App.css';

function App() {
  async function requestNotificationPermission() {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      // console.log("Permiso para notificaciones concedido.");
    } else {
      // console.warn("Permiso para notificaciones denegado.");
    }
  }

  function showNotification() {
    if (Notification.permission === "granted") {
      const notification = new Notification("Título de la notificación", {
        body: "Cuerpo del mensaje de la notificación",
       
      });

      // Puedes agregar un evento de clic para redirigir al usuario a una página específica al hacer clic en la notificación.
      notification.onclick = () => {
        window.focus(); // Enfocar la ventana de la aplicación (opcional).
        // Aquí puedes realizar una acción específica al hacer clic en la notificación.
      };
    }
  }


  // useEffect(() => {
  //     showNotification();
  // }, []);



  return (
    <div className='App'>
      <Landing />
    </div>
  );
}

export default App;





