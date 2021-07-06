# ip-input-vue

[Demo](https://lang1427.github.io/ip-input-vue/)

## Install
```
npm install ip-input-vue
```

## Quick Start
```js
import vueIp from "ip-input-vue";
Vue.use(vueIp)
```

### Props
| Prop        	| Type     	| Default                 | Explain
|-------------	|----------	|------------------------ |------------------------
| set_ip   	    | String 	| ""                      | 设置ip的值
| set_port      | String   	| ""                      | 设置端口的值
| isDisabled    | Boolean   | false                   | 是否禁用(和只读)
| need_port 	| Boolean   | false                   | 是否需要端口号

### Events
| EventName     | Explain           | Params     	
|-------------	|-------------------|------------------------
| getIP   	    | 获取IP             | ip 
| getPort      	| 获取端口           | port   

### Methods
| MethodName    | Explain                               | Params     	
|-------------	|---------------------------------------|------------------------
| vaildIp   	| 验证ip是否输入完整，返回值为布尔类型     | - 


