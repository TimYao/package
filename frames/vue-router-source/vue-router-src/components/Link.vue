<script>
export default {
  name: 'RouterLink',
  props: {
    to: {
      type: [String, Object],
      required: true
    },
    tag: {
      type: String,
      default: 'a'
    },
    event: {
      type: [String, Object],
      default: 'click'
    }
  },
  render(h){
    const router = this.$router;
    // console.log(router);
    const handler = e => {
      console.log(e);
      router.push(this.to);
    }

    const on = {click: handler};

    return h(this.tag, {
      on
    }, this.$slots.default)
  }
}

</script>