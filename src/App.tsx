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
import UserListDemo from './lessons/day04/step02-list/UserListDemo'
import UserSearchDemo from './lessons/day04/step03-search/UserSearchDemo'
import UserManagementDeleteDemo from './lessons/day04/step04-delete/UserManagementDeleteDemo'
import EffectDependencyDemo from './lessons/day05/step01-effect/EffectDependencyDemo'
import EffectCleanupDemo from './lessons/day05/step02-cleanup/EffectCleanupDemo'
import LifecycleDemo from './lessons/day05/step03-lifecycle/LifecycleDemo'
import UseCallbackDemo from './lessons/day05/step04-callback/UseCallbackDemo'
import UserSearchHooksDemo from './lessons/day05/step05-hooks/UserSearchHooksDemo'
import RenderDemo from './lessons/day06/step01-render/RenderDemo'
import MemoDemo from './lessons/day06/step02-memo/MemoDemo'
import UseMemoDemo from './lessons/day06/step03-memo/UseMemoDemo'
import CallbackMemoDemo from './lessons/day06/step04-callback-memo/CallbackMemoDemo'
import UserManagementPerformanceDemo from './lessons/day06/step05-performance/UserManagementPerformanceDemo'
import UserManagementWeek1Demo from './lessons/day07/UserManagementWeek1Demo'
import TestCase from './lessons/day08/TestCase'
import CleanupDemo from './lessons/day10/CleanupDemo'

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
  { day: 4, title: '条件渲染', component: UserManagementDemo },
  { day: 4, title: '列表渲染与组件组合', component: UserListDemo },
  { day: 4, title: '搜索与过滤用户列表', component: UserSearchDemo },
  { day: 4, title: '组件组合与删除', component: UserManagementDeleteDemo },

  { day: 5, title: 'useEffect 依赖数组深入理解', component: EffectDependencyDemo },
  { day: 5, title: 'Effect Cleanup', component: EffectCleanupDemo },
  { day: 5, title: '组件挂载、更新、卸载', component: LifecycleDemo },
  { day: 5, title: 'useCallback', component: UseCallbackDemo },
  { day: 5, title: 'Hooks 综合实战', component: UserSearchHooksDemo },

  { day: 6, title: 'React 渲染机制', component: RenderDemo },
  { day: 6, title: 'React.memo', component: MemoDemo },
  { day: 6, title: 'useMemo', component: UseMemoDemo },
  { day: 6, title: 'useCallback + React.memo', component: CallbackMemoDemo },
  { day: 6, title: '性能优化综合实战', component: UserManagementPerformanceDemo },

  { day: 7, title: '一周总结', component: UserManagementWeek1Demo },

  { day: 8, title: 'HTTP 请求基础、Axios 与 Fetch', component: UserManagementWeek1Demo },
  { day: 8, title: 'Promise、async/await', component: TestCase },
  { day: 8, title: 'API Service 封装', component: UserManagementWeek1Demo },
  { day: 8, title: 'GET 请求与 JSON 响应', component: UserManagementWeek1Demo },
  { day: 8, title: '用户查询接口实战', component: UserManagementWeek1Demo },
  { day: 8, title: '综合验收', component: UserManagementWeek1Demo },

  { day: 10, title: '组件卸载时的 Cleanup', component: CleanupDemo },
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




