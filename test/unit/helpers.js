import Vue from 'vue'

export const getRenderedText = (Component, propsData) => {
  const Ctor = Vue.extend(Component)
  const vm = new Ctor({ propsData: propsData }).$mount()
  return vm.$el.textContent
}
