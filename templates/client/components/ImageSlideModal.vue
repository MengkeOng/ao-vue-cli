<template>
  <modal :visible="visible" @close="close" transition="zoom" class="slide-modal">
    <div class="full-overlay">
      <div class="overlay-title has-text-centered">
        <span>{{image.photoType}}</span>
        <!-- <span ng-bind="image.createdAt | date:'yyyy/MM/dd HH:mm:ss'" class="text-muted"></span> -->
      </div>
      <div class="overlay-container">
        <div class="img-box" :class="{'rotate-90':deg===90,'rotate-180':deg===180,'rotate-270':deg===270}">
          <img :src="image.originalPhotoUrl">
        </div>
      </div>
      <div @click="showPrevImage()" class="handle-ctrl handle-prev handle-arrow"><i class="fa fa-angle-left"></i></div>
      <div @click="showNextImage()" class="handle-ctrl handle-next handle-arrow"><i class="fa fa-angle-right"></i></div>
      <div @click="rotate()" class="handle-ctrl handle-rotate"><i class="fa fa-rotate-right"></i></div>
      <!-- <div @click="close()" class="handle-ctrl handle-close">&times;</div> -->
    </div>
  </modal>
</template>

<script>
import { Modal } from 'vue-bulma-modal'

export default {
  components: {
    Modal
  },
  data() {
    return {
      deg: 0,
      image: {}
    }
  },
  props: {
    index: Number,
    visible: Boolean,
    sourceData: Array
  },
  mounted() {
    this.image = this.getImageByIndex(this.index)
  },
  methods: {
    close () {
      this.$emit('close')
    },
    rotate() {
      this.deg += 90;
      if (this.deg===360) this.deg = 0
    },
    showPrevImage() {
      this.deg = 0;
      this.index--;
      if (this.index===-1) this.index = this.sourceData.length-1;
      this.image = this.getImageByIndex(this.index);
    },
    showNextImage() {
      this.deg = 0;
      this.index++;
      if (this.index===this.sourceData.length) this.index = 0;
      this.image = this.getImageByIndex(this.index);
    },
    getImageByIndex(index) {
      return this.sourceData[index] || {}
    }
  }
}
</script>

<style lang="scss">
@import '../styles/mixins';
.full-overlay {
  position: fixed;
  top:0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10000;
  background: rgba(255,255,255,1);
  &.scroll-vertical {
    overflow-y: auto;
  }
  > .overlay-title {
    width: 100%;
    padding: 12px;
    font-size: 24px;
    line-height: 1;
    position: absolute;
    /*font-weight: bold;*/
  }
  > .overlay-container {
    position: absolute;
    top: 48px;
    left: 48px;
    right: 48px;
    bottom: 48px;
    > .img-box {
      position: absolute;
      width: 100%;
      height: 100%;
      > img {
        position: absolute;
        top: 50%;
        left: 50%;
        max-width: 100%;
        max-height: 100%;
        @include translate(-50%,-50%);
      }
    }
  }
  > .handle-ctrl {
    position: absolute;
    line-height: 0.5;
    font-size: 36px;
    font-family: -webkit-body;
    opacity: 0.5;
    cursor: pointer;
  }
  > .handle-arrow {
    top: 50%;
    margin-top: -30px;
    padding: 12px 24px;
    border-radius: 100%;
    &:hover {
      background: rgba(0,0,0,0.25);
    }
  }
  > .handle-rotate {
    bottom: 12px;
    left: 50%;
    @include translate(-50%,0);
  }
  > .handle-close {
    top: 12px;
    right: 12px;
  }
  > .handle-prev {
    left: 12px;
  }
  > .handle-next {
    right: 12px;
  }

  // rotate deg
  .rotate-90 { @include rotate(90deg) }
  .rotate-180 { @include rotate(180deg) }
  .rotate-270 { @include rotate(270deg) }

  // z-index manager
  .handle-ctrl { z-index:100 }
  .handle-close {}
  .handle-arrow {}
  .handle-rotate {}
  .overlay-title { z-index:99 }
  .overlay-container { z-index:98 }
}
</style>
