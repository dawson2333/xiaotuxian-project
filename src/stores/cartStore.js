//封装购物车模块
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useUserStore } from './userStore'
import { insertCartAPI, findNewCartListAPI, delCartAPI } from '@/apis/cart'

export const useCartStore = defineStore('cart', () => {
    const userStore = useUserStore()
    const isLogin = computed(() => userStore.userInfo.token)
    //定义state
    const cartList = ref([])
    //获取最新购物车数据列表action
    const updateNewList = async () => {
        const res = await findNewCartListAPI()
        cartList.value = res.result
    }
    //定义action
    const addCart = async (goods) => {
        const { skuId, count } = goods
        if (isLogin.value) {
            //登陆后的加入购物车逻辑
            await insertCartAPI({ skuId, count })
            updateNewList()
        } else {
            //添加购物车
            //已添加过- count+1
            //没有添加过-直接push
            //通过匹配传递过来的skuId能不能在cart List中找到，来判断是否添加过
            const item = cartList.value.find((item) => goods.skuId === item.skuId)
            if (item) {
                //找到了
                item.count++
            }
            else {
                //没找到
                cartList.value.push(goods)
            }
        }

    }
    // 删除购物车
    const delCart = async (skuId) => {
        if (isLogin.value) {
            // 调用接口实现接口购物车中的删除功能
            await delCartAPI([skuId])
            updateNewList()
        } else {
            // 思路：
            // 1. 找到要删除项的下标值 - splice
            // 2. 使用数组的过滤方法 - filter
            const idx = cartList.value.findIndex((item) => skuId === item.skuId)
            cartList.value.splice(idx, 1)
        }
    }

    //清除购物车
    const clearCart = () => {
        cartList.value = []
    }

    //单选功能
    const singleCheck = (skuId, selected) => {
        //找到需要修改的项，修改selected
        const item = cartList.value.find((item) => item.skuId === skuId)
        item.selected = selected
    }

    //全选功能
    const allCheck = (selected) => {
        //把cartlist的每一项都设为当前全选框的状态值
        cartList.value.forEach(item => item.selected = selected)
    }

    //计算属性
    //1.总的数量 所有项的count之和
    const allCount = computed(() => cartList.value.reduce((a, c) => a + c.count, 0))
    //2.总价 所有项的count*price之和
    const allPrice = computed(() => cartList.value.reduce((a, c) => a + c.count * c.price, 0))
    //3.已选择数量
    const selectedCount = computed(() => cartList.value.filter(item => item.selected).reduce((a, c) => a + c.count, 0))
    //4.已选择商品的价格合计
    const selectedPrice = computed(() => cartList.value.filter(item => item.selected).reduce((a, c) => a + c.count * c.price, 0))

    //是否全选
    const isAll = computed(() => cartList.value.every((item) => item.selected))

    return {
        cartList,
        addCart,
        delCart,
        allCount,
        allPrice,
        singleCheck,
        isAll,
        allCheck,
        selectedCount,
        selectedPrice,
        clearCart,
        updateNewList
    }
},
    {
        persist: true,
    })