export default function eventLog($event) {
  console.log($event.type, $event.path, (
    typeof $event.value === 'object'
  ) ? $event.target.toString({space: 2, replacer: null })
    : $event.value
  )
}