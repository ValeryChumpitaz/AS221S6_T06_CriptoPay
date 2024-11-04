import React from 'react';
import Sidebar from '../../components/navigation/Sidebar';
import '../../styles/dashboard/SchedulesPage.css';

const schedulesData = [
  { day: 'Lunes', start: '08:00', end: '12:00' },
  { day: 'Martes', start: '09:00', end: '13:00' },
  { day: 'Miércoles', start: '10:00', end: '14:00' },
  { day: 'Jueves', start: '08:00', end: '12:00' },
  { day: 'Viernes', start: '09:00', end: '13:00' },
];

function Schedules() {
  return (
    <div className="schedules-container">
      <Sidebar />
      <div className="schedules-content">
        <header className="schedules-header">
          <h1>Horarios</h1>
          <p>Consulta los horarios de las clases y actividades semanales.</p>
        </header>
        <section className="schedules-table">
          <table>
            <thead>
              <tr>
                <th>Día</th>
                <th>Inicio</th>
                <th>Fin</th>
              </tr>
            </thead>
            <tbody>
              {schedulesData.map((schedule, index) => (
                <tr key={index}>
                  <td>{schedule.day}</td>
                  <td>{schedule.start}</td>
                  <td>{schedule.end}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}

export default Schedules;
