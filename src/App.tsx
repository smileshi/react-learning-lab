import { useState } from 'react'
import IntroDemo from './lessons/day01/step01-intro/IntroDemo'
import JsxDemo from './lessons/day01/step02-jsx/JsxDemo'
import UserPage from './lessons/day01/step03-components-props/UserPage'
import UserStateDemo from './lessons/day01/step04-usestate/UserStateDemo'
import UserEffectDemo from './lessons/day01/step05-useeffect/UserEffectDemo'
import UserSearch from './lessons/day01/step06-useref/UserSearch'
import UserFormDemo from './lessons/day02/step01-events-forms/UserFormDemo'
import UserValidationDemo from './lessons/day02/step02-form-validation/UserValidationDemo'
import UserCreateDemo from './lessons/day02/step04-user-create/UserCreateDemo'
import UserSubmitDemo from './lessons/day02/step03-form-submit/UserSubmitDemo'
import './App.css'
import UserListApiDemo from './lessons/day03/step01-axios/UserListApiDemo'
import UserListAutoApiDemo from './lessons/day03/step02-useeffect/UserListAutoApiDemo'
import UserListStatusApiDemo from './lessons/day03/step03/UserListStatusApiDemo'
import UserListServiceApiDemo from './lessons/day03/step04/UserListServiceApiDemo'
import UserManagementDemo from './lessons/day03/step05-user-management/UserManagementDemo'

const lessons = [
  { day: 1, title: '组件入门', component: IntroDemo },
  { day: 1, title: 'JSX 与列表渲染', component: JsxDemo },
  { day: 1, title: '组件与 Props', component: UserPage },
  { day: 1, title: 'useState 状态管理', component: UserStateDemo },
  { day: 1, title: 'useEffect 副作用', component: UserEffectDemo },
  { day: 1, title: 'useRef 与 DOM', component: UserSearch },
  { day: 2, title: '事件与受控表单', component: UserFormDemo },
  { day: 2, title: '表单校验', component: UserValidationDemo },
  { day: 2, title: '表单提交', component: UserSubmitDemo },
  { day: 2, title: '创建用户', component: UserCreateDemo },
  { day: 3, title: 'Axios 基础及真实 GET', component: UserListApiDemo },
  { day: 3, title: 'useEffect 自动获取数据', component: UserListAutoApiDemo },
  { day: 3, title: 'Loading、Error、Success 状态管理', component: UserListStatusApiDemo },
  { day: 3, title: 'API Service 封装', component: UserListServiceApiDemo },
  { day: 3, title: '用户管理综合实战', component: UserManagementDemo },
]

const days = [...new Set(lessons.map(lesson => lesson.day))]

function App() {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const selectedLesson = lessons[selectedIndex]
  const dayLessons = lessons.filter(lesson => lesson.day === selectedLesson.day)
  const selectedStep = dayLessons.indexOf(selectedLesson) + 1
  const SelectedDemo = selectedLesson.component

  return (
    <div className="learning-lab">
      <aside className="sidebar">
        <h1>React 学习实验室</h1>
        <p>每天一步，动手学习 React</p>
        <label className="day-label" htmlFor="learning-day">选择学习日</label>
        <select
          id="learning-day"
          className="day-select"
          value={selectedLesson.day}
          onChange={event => setSelectedIndex(
            lessons.findIndex(lesson => lesson.day === Number(event.target.value))
          )}
        >
          {days.map(day => <option key={day} value={day}>Day {day}</option>)}
        </select>
        <p className="day-summary">Day {selectedLesson.day} · 共 {dayLessons.length} 节课程</p>
        <nav aria-label="学习课程">
          {dayLessons.map((lesson, index) => (
            <button
              key={lesson.title}
              type="button"
              className={selectedLesson === lesson ? 'lesson-link active' : 'lesson-link'}
              aria-current={selectedLesson === lesson ? 'page' : undefined}
              onClick={() => setSelectedIndex(lessons.indexOf(lesson))}
            >
              <span>Day {lesson.day} · Step {index + 1}</span>
              <strong>{lesson.title}</strong>
            </button>
          ))}
        </nav>
      </aside>
      <main className="lesson-main">
        <header className="lesson-header">
          <p>Day {selectedLesson.day} · Step {selectedStep}</p>
          <h2>{selectedLesson.title}</h2>
          <p>动手操作下方示例，观察页面变化。切换课程后，示例状态会重置。</p>
        </header>
        <section className="demo-panel" aria-label={selectedLesson.title}>
          <SelectedDemo key={selectedIndex} />
        </section>
      </main>
    </div>
  )
}

export default App




