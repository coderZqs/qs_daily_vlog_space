  display: grid;

  /*  声明列的宽度  */
  grid-template-columns: 200px 200px 200px;
  grid-template-rows: 100px 100px 100px;
  justify-content: space-evenly;
  /* grid-template-areas:
    ". image image"`
    "footer content content";
 */
  // fr关键字：空间分配，类似flex：1；
  // minmax： 可以定义可分配的最大宽度和最小宽度
  // auto     类似于flex:1，如果使用了auto，则无法使用fr， auto优先级最大
  // area
  // grid-tempalte     以 / 隔开
  // grid-auto-flow      default：row，  dense 紧凑模式，
  // grid-column       设置左右边框的位置
  // grid-row          设置上下边框的位置
  // strech
