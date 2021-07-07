<template>
  <div class="kl_ip_input">
    <slot></slot>
    <span :key="index" v-for="(item, index) in ipAdress">
      <input
        :class="{ input_all_compulte: in_complute }"
        autocomplete="off"
        :readonly="isDisabled"
        maxlength="3"
        type="tel"
        pattern="[0-9]{1,3}"
        @input="_checkIpVal(item, index, $event)"
        :disabled="isDisabled"
        @keyup="_ip_keyup(item, index, $event)"
        @keydown="_ip_keydown(item, index, $event)"
        v-model="item.value"
        ref="ipInput"
      />
      <span v-if="index < 3" class="kl_ip_break">.</span>
    </span>
    <template v-if="need_port">
      <span class="kl_port_break">:</span>
      <input
        type="tel"
        autocomplete="off"
        :class="{ input_all_compulte: in_complute }"
        class="kl_port_input"
        :readonly="isDisabled"
        :disabled="isDisabled"
        pattern="[0-9]{1,5}"
        maxlength="5"
        @input="_checkPortVal"
        @keyup="_port_keyup($event)"
        @keydown="_port_keydown($event)"
        v-model.trim="port"
        ref="portInput"
      />
    </template>
  </div>
</template>
<script>
import {getCursortPosition} from 'methods-util'
export default {
  name: "vueIp",
  data() {
    return {
      ipAdress: [
        {
          value: "",
        },
        {
          value: "",
        },
        {
          value: "",
        },
        {
          value: "",
        },
      ],
      port: "",
      cur_position: -1,
    };
  },
  computed: {
    in_complute: function () {
      if (this.need_port) {
        return (
          this.ipAdress.every((item) => {
            return item.value != "";
          }) && !!this.port
        );
      } else {
        return this.ipAdress.every((item) => {
          return item.value != "";
        });
      }
    },
  },
  props: {
    set_ip: {
      trype: String,
      default: "",
    },
    set_port: {
      type: String,
      default: "",
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    need_port: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    set_ip: {
      immediate: true,
      handler: function (vall) {
        let val = vall;
        let nArr = [];
        if (val && val.includes(".") && val.length > 0) {
          let valArr = val.split(".");
          let m = valArr.length;
          for (let i = 0; i < 4; i++) {
            if (valArr[i] == "null" || valArr[i] == "undefined") {
              valArr[i] = "";
            }
            if (i < m) {
              nArr.push({
                value: valArr[i],
              });
            } else {
              nArr.push({
                value: "",
              });
            }
          }
        } else {
          nArr = [
            {
              value: "",
            },
            {
              value: "",
            },
            {
              value: "",
            },
            {
              value: "",
            },
          ];
        }
        this.ipAdress = nArr;
      },
    },
    set_port: {
      immediate: true,
      handler: function (val) {
        if (Number.isNaN(Number(val))) {
          this.port = "";
        } else {
          this.port = val;
        }
      },
    },
  },
  methods: {
    vaildIp() {
      return this.ipAdress.every((item) => {
        return item.value != "";
      });
    },

    _checkIpVal(item, index, event) {
      let self = this;

      if (/[^\d]/g.test(item.value)) {
        let cache = JSON.parse(JSON.stringify(self.ipAdress));
        cache[index].value = item.value
          .replace(/[^\d]/g, "")
          .replace(/[\.]/g, "");
        self.ipAdress = cache;
        return false;
      }

      if (item.value.replace(/[^\d]/g, "").length >= 3) {
        let val = parseInt(item.value.replace(/[^\d]/g, ""), 10);
        if (isNaN(val)) {
          val = "";
        } else if (val > 255) {
          val = 255;
        } else {
          val = val < 0 ? 0 : val;
        }
        item.value = String(val);
        this.$set(this.ipAdress, index, item);
        if (index < 3) {
          self.$refs.ipInput[index + 1].focus();
        }
      }

      this.$emit(
        "get-ip",
        `${this.ipAdress[0].value}.${this.ipAdress[1].value}.${this.ipAdress[2].value}.${this.ipAdress[3].value}`
      );
    },
    _ip_keyup(item, index, event) {
      let self = this;
      let e = event || window.event;
      let cur_input = self.$refs.ipInput[index];
      // 左移 ←
      if (e.keyCode == 37 && this.cur_position == 0) {
        if (index != 0) {
          self.$refs.ipInput[index - 1].focus();
        }
      }
      if (
        (e.keyCode == 39 && this.cur_position == cur_input.value.length) || // 右移 →
        e.keyCode == 13 || // 回车
        e.keyCode == 32 || // 空格
        e.keyCode == 110 || // .
        e.keyCode == 190 // .>
      ) {
        e.preventDefault();
        e.returnValue = false;
        if (index < 3) {
          self.$refs.ipInput[index + 1].focus();
        }
        if (index === 3 && this.need_port) {
          self.$refs.portInput.focus();
        }
        return false;
      }
    },
    _ip_keydown(item, index, event) {
      this.cur_position = getCursortPosition(this.$refs.ipInput[index]);
      let self = this;
      let e = event || window.event;

      let val = parseInt(item.value.replace(/[^\d]/g, ""), 10);
      val = isNaN(val) ? "" : val;
      // 删除键 Backspace
      if (e.keyCode == 8 && index > 0 && val.length == 0) {
        e.preventDefault();
        self.$refs.ipInput[index - 1].focus();
      }
    },
    _checkPortVal() {
      this.port = this.port.replace(/[^\d]/g, "");
      if (this.port.length >= 5 && Number(this.port) > 65535) {
        this.port = 65535;
      }
      this.$emit("get-port", this.port);
    },
    _port_keyup(event) {
      let self = this;
      let e = event || window.event;
      // 左移 ←
      if (e.keyCode == 37 && this.cur_position == 0) {
        self.$refs.ipInput[3].focus();
      }
    },
    _port_keydown(event) {
      this.cur_position = getCursortPosition(this.$refs.portInput);
      let self = this;
      let e = event || window.event;

      let val = parseInt(this.port.toString().replace(/[^\d]/g, ""), 10);
      val = isNaN(val) ? "" : val;
      // 删除键 Backspace
      if (e.keyCode == 8 && val.length == 0) {
        e.preventDefault();
        self.$refs.ipInput[3].focus();
      }
    },

    getCursortPosition(dom) {
      // ie
      if (document.selection) {
        let range = document.selection.createRange();
        range.setEndPoint("StartToStart", dom.createTextRange());
        return range.text.length;
      } else {
        return dom.selectionStart;
      }
    },
  },
};
</script>
<style lang="less" scoped>
.kl_ip_input {
  position: relative;
  span {
    margin-left: 5px;
    position: relative;
    .kl_ip_break {
      color: #666;
      position: relative;
      bottom: -10px;
      width: 2px;
    }
  }
  input {
    text-align: center;
    box-sizing: border-box;
    padding: 0 3px;
    background: transparent;
    height: 30px;
    outline: none;
    width: 60px;
    border: none;
    border-bottom: 1px solid #ccc;
    &:focus {
      border-bottom-color: red;
    }
    &.input_all_compulte {
      border-bottom: 2px solid rgb(62, 175, 124) !important;
    }
  }
  .kl_port_break {
    color: #666;
    margin: 0 2px;
    bottom: -4px;
  }
}
</style>
