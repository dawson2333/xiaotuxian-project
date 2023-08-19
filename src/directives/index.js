import { useIntersectionObserver } from '@vueuse/core'
//定义全局指令
//定义懒加载
export const lazyPlugin={
    install(app){
        //指令逻辑
        app.directive('img-lazy', {
            mount(el, binding) {
                //el--指令绑定的img元素
                //binding--调用绑定元素的值和属性
                // console.log(el, binding.value)
                const { stop } = useIntersectionObserver(
                    el,
                    ([{ isIntersecting }]) => {
                      console.log(isIntersecting)
                      if (isIntersecting) {
                        // 进入视口区域
                        el.src = binding.value
                        stop()
                      }
                    },
                  )
            }
        })
    }
}