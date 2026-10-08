---
title: go语言基础知识
description: go语言基础知识
date: 2026-10-08
category: Go
draft: false
---
# Go 语言基础语法与 CRUD 实战手册

> 面向有 JavaScript / TypeScript 基础的前端开发者。示例采用 Go 1.22+ 常用语法；涉及较新标准库 API 时会注明版本。

## 目录

1. 环境与项目初始化
2. 变量、常量、类型与零值
3. 运算符、类型转换与控制流
4. 数组、切片与完整增删改查
5. Map 的完整增删改查
6. 字符串、字节和 Unicode
7. 函数、闭包、defer 与参数传递
8. 指针、结构体、方法与接口
9. 错误处理与 panic
10. 包、模块、可见性与依赖管理
11. JSON、时间、文件与排序
12. 泛型
13. Goroutine、Channel、锁与 Context
14. HTTP 与 Gin CRUD 示例
15. 测试、常用命令和常见坑
16. JavaScript / TypeScript 对照表
17. 七天学习路线与练习

---

## 1. 环境与项目初始化

```bash
go version
mkdir go-basics && cd go-basics
go mod init example.com/go-basics
```

创建 `main.go`：

```go
package main

import "fmt"

func main() {
    fmt.Println("Hello, Go!")
}
```

```bash
go run .             # 运行
go build .           # 编译
go fmt ./...         # 格式化
go vet ./...         # 静态检查
go test ./...        # 测试
go mod tidy          # 整理依赖
```

`package main` + `func main()` 构成可执行程序入口。一个目录中的普通 Go 源文件通常属于同一个包。

## 2. 变量、常量、类型与零值

```go
var name string = "Tom"
var age = 18
score := 95              // := 只能用于函数内部
var x, y int = 1, 2
const Pi = 3.14159
const (
    Pending = iota
    Running
    Finished
)
```

常用类型：`bool`、`string`、`int`、`int8/16/32/64`、`uint`、`float32/64`、`byte`（`uint8` 别名）、`rune`（`int32` 别名）。`any` 是 `interface{}` 的别名。

零值：数字 `0`，布尔 `false`，字符串 `""`，指针、切片、Map、函数、接口和 Channel 的零值为 `nil`。**nil Map 可以读取，但不能直接赋值；nil Slice 可以 append。**

```go
var items []int
items = append(items, 1) // OK
var counts map[string]int
// counts["a"] = 1       // panic：向 nil map 写入
counts = make(map[string]int)
counts["a"] = 1
```

## 3. 运算符、类型转换与控制流

```go
func demo() {
    a, b := 10, 3
    fmt.Println(a+b, a-b, a*b, a/b, a%b) // 13 7 30 3 1
    a++                                    // ++ 是语句，不是表达式
    fmt.Println(a == b, a != b, a > b, a >= b)
    fmt.Println(true && false, true || false, !true)

    f := float64(a)
    fmt.Println(f)
    n, err := strconv.Atoi("123")
    if err != nil { fmt.Println(err); return }
    fmt.Println(strconv.Itoa(n))

    if n > 100 { fmt.Println("big") } else { fmt.Println("small") }
    switch n {
    case 123: fmt.Println("match")
    default: fmt.Println("other")
    }
    for i := 0; i < 3; i++ { fmt.Println(i) }
    for n > 0 { n-- } // 类似 while
}
```

以上片段需导入 `fmt` 和 `strconv`。Go 条件必须是布尔值，不能写 `if n {}`。`switch` 默认不贯穿下一分支。`for range` 可遍历切片、Map、字符串等。Go 1.22+ 的整数 `range` 还可写 `for i := range 5 { ... }`。

## 4. 数组、切片与完整增删改查

数组 `[3]int{1,2,3}` 长度固定；切片 `[]int{1,2,3}` 长度可变。`len` 是元素数，`cap` 是容量。

```go
package main

import (
    "fmt"
    "slices"
)

func main() {
    nums := []int{10, 20, 30}

    // 增：尾部追加、批量追加
    nums = append(nums, 40)
    nums = append(nums, 50, 60)

    // 增：在索引 1 插入 15（Go 1.21+）
    nums = slices.Insert(nums, 1, 15)

    // 查：下标、存在性、索引
    fmt.Println(nums[0])
    fmt.Println(slices.Contains(nums, 30))
    fmt.Println(slices.Index(nums, 30)) // 不存在返回 -1

    // 改
    nums[0] = 11

    // 删：删除 [2,3) 区间（Go 1.21+）
    nums = slices.Delete(nums, 2, 3)

    // 按值删除首次匹配项
    if i := slices.Index(nums, 40); i >= 0 {
        nums = slices.Delete(nums, i, i+1)
    }

    // 遍历
    for i, v := range nums { fmt.Println(i, v) }

    // 排序、反转、克隆、清空
    slices.Sort(nums)
    slices.Reverse(nums)
    clone := slices.Clone(nums)
    fmt.Println(clone)
    nums = nums[:0] // 清空长度，保留底层存储
}
```

不使用 `slices` 的删除方式：

```go
nums := []int{10, 20, 30, 40}
i := 1
nums = append(nums[:i], nums[i+1:]...) // [10 30 40]
```

注意：切片截取 `part := nums[1:3]` **共享底层数组**，修改元素可能影响原切片；需要独立副本时用 `slices.Clone(nums)` 或 `append([]int(nil), nums...)`。`append` 可能重新分配底层数组，因此应接收返回的切片。

二维切片：

```go
matrix := [][]int{{1, 2}, {3, 4}}
fmt.Println(matrix[1][0]) // 3
```

## 5. Map 的完整增删改查

```go
package main

import (
    "fmt"
    "maps"
)

func main() {
    scores := map[string]int{"Tom": 90}
    scores["Jack"] = 80                 // 增
    score, exists := scores["Tom"]      // 查，区分不存在和零值
    fmt.Println(score, exists)
    scores["Tom"] = 100                // 改
    delete(scores, "Jack")             // 删
    for name, score := range scores {   // 遍历（顺序不固定）
        fmt.Println(name, score)
    }
    copyMap := maps.Clone(scores)       // Go 1.21+
    fmt.Println(copyMap)
    clear(scores)                       // Go 1.21+，清空
}
```

Map 键必须可比较（例如 string、int、某些 struct），切片不能作为 Map 键。Map **不是并发安全的**，并发读写需要锁或 `sync.Map` 等方案。Map 元素不能直接取地址；如果值是 struct，通常取出、修改后再写回，或保存 `*Struct`。

```go
type User struct { Name string; Age int }
users := map[int]User{1: {Name: "Tom", Age: 18}}
u := users[1]
u.Age = 19
users[1] = u
```

## 6. 字符串、字节和 Unicode

```go
package main
import (
    "fmt"
    "strings"
    "strconv"
    "unicode/utf8"
)
func main() {
    s := "你好Go"
    fmt.Println(len(s))                    // 8：UTF-8 字节数
    fmt.Println(utf8.RuneCountInString(s)) // 4：Unicode 码点数
    for i, r := range s { fmt.Println(i, string(r)) } // i 是字节偏移
    fmt.Println(strings.Contains(s, "Go"))
    fmt.Println(strings.ReplaceAll(s, "Go", "世界"))
    fmt.Println(strings.Split("a,b,c", ","))
    fmt.Println(strings.Join([]string{"a", "b"}, "-"))
    fmt.Println(strings.TrimSpace(" hello "))
    fmt.Println(strings.ToUpper("hello"))
    fmt.Println(strconv.Itoa(123))
    n, err := strconv.Atoi("123")
    fmt.Println(n, err)
    fmt.Println(fmt.Sprintf("%s %d", "age", 18))
}
```

字符串不可原地修改；需要按码点修改可先转 `[]rune`，再转回 `string`。一个视觉上的 Emoji 可能由多个 rune 组成。

## 7. 函数、闭包、defer 与参数传递

```go
package main
import (
    "errors"
    "fmt"
)

func add(a, b int) int { return a + b }

func divide(a, b float64) (float64, error) {
    if b == 0 { return 0, errors.New("除数不能为零") }
    return a / b, nil
}

func sum(nums ...int) int {
    total := 0
    for _, n := range nums { total += n }
    return total
}

func apply(a, b int, fn func(int, int) int) int { return fn(a, b) }

func counter() func() int {
    count := 0
    return func() int { count++; return count }
}

func main() {
    fmt.Println(add(1, 2))
    v, err := divide(10, 2)
    if err != nil { fmt.Println(err); return }
    fmt.Println(v, sum(1, 2, 3))
    fmt.Println(apply(2, 3, func(a, b int) int { return a * b }))
    next := counter()
    fmt.Println(next(), next()) // 1 2
    defer fmt.Println("最后执行")
    fmt.Println("先执行")
}
```

Go **按值传参**：传递结构体会复制结构体；传递指针会复制地址；传递切片会复制切片头（通常共享底层数组）；传递 Map 会复制引用其底层数据结构的值。需要修改调用者的切片长度时，应返回新切片或传 `*[]T`。

`defer` 在函数返回前执行，多个 defer 后进先出；defer 调用的实参通常在执行 defer 语句时求值。

## 8. 指针、结构体、方法与接口

```go
package main
import "fmt"

type User struct {
    ID   int    `json:"id"`
    Name string `json:"name"`
    Age  int    `json:"age"`
}

func (u User) Greeting() string { return "Hi, " + u.Name }
func (u *User) Birthday() { u.Age++ }

type Greeter interface { Greeting() string }

func sayHello(g Greeter) { fmt.Println(g.Greeting()) }

func main() {
    u := User{ID: 1, Name: "Tom", Age: 18}
    ptr := &u
    ptr.Birthday() // 指针接收者修改原结构体
    fmt.Println(u.Age, (*ptr).Name)
    sayHello(u)    // 隐式实现接口，无需 implements

    var x any = "hello"
    if s, ok := x.(string); ok { fmt.Println(s) }
}
```

`&x` 获取地址，`*p` 解引用。首字母大写的字段/方法可跨包访问；JSON 反序列化通常需要导出字段。值接收者和指针接收者的方法集不同：`User` 的方法集不包括仅在 `*User` 上定义的方法。

## 9. 错误处理与 panic

```go
package main
import (
    "errors"
    "fmt"
)

var ErrNotFound = errors.New("not found")

func findUser(id int) (string, error) {
    if id <= 0 { return "", fmt.Errorf("invalid id %d: %w", id, ErrNotFound) }
    return "Tom", nil
}

func main() {
    name, err := findUser(0)
    if err != nil {
        if errors.Is(err, ErrNotFound) { fmt.Println("用户不存在") }
        fmt.Println(err)
        return
    }
    fmt.Println(name)
}
```

- 正常失败优先 `return error`，不要用 `panic` 替代业务错误。
- `fmt.Errorf("...: %w", err)` 包装错误；`errors.Is` 比较错误链；`errors.As` 提取特定错误类型。
- `panic` 用于严重的异常状态；`recover` 仅在正在执行的延迟函数中恢复当前 Goroutine 的 panic，不能跨 Goroutine 捕获。

## 10. 包、模块、可见性与依赖管理

```text
go-basics/
├── go.mod
├── main.go
└── models/
    └── user.go
```

`models/user.go`：

```go
package models
type User struct { ID int; Name string }
```

`main.go`：

```go
package main
import (
    "fmt"
    "example.com/go-basics/models"
)
func main() { fmt.Println(models.User{ID: 1, Name: "Tom"}) }
```

```bash
go get github.com/gin-gonic/gin
go mod tidy
go list -m all
go doc fmt.Println
```

Go 的可见性由标识符首字母大小写决定，不使用 `public/private`。`go.mod` 管理模块路径和依赖，`go.sum` 记录依赖校验信息。

## 11. JSON、时间、文件与排序

### JSON 序列化与反序列化

```go
package main
import (
    "encoding/json"
    "fmt"
)
type User struct {
    ID int `json:"id"`
    Name string `json:"name"`
    Password string `json:"-"` // 不参与 JSON 编解码
}
func main() {
    raw, err := json.Marshal(User{ID: 1, Name: "Tom", Password: "secret"})
    if err != nil { panic(err) }
    fmt.Println(string(raw))
    var u User
    if err := json.Unmarshal(raw, &u); err != nil { panic(err) }
    fmt.Println(u)
}
```

`omitempty` 可以省略零值字段；`map[string]any` 解码 JSON 数字时默认得到 `float64`，若需要保留数字精度可使用 `Decoder.UseNumber()` 或明确结构体类型。

### 时间

```go
now := time.Now()
fmt.Println(now.Format("2006-01-02 15:04:05"))
next := now.Add(24 * time.Hour)
fmt.Println(next.Sub(now))
t, err := time.Parse("2006-01-02", "2026-10-08")
fmt.Println(t, err)
```

Go 使用固定参考时间 `2006-01-02 15:04:05`，不是 `YYYY-MM-DD` 模板。上述片段导入 `time` 和 `fmt`。

### 文件

```go
if err := os.WriteFile("demo.txt", []byte("hello"), 0644); err != nil { return }
data, err := os.ReadFile("demo.txt")
if err != nil { return }
fmt.Println(string(data))
```

文件片段适合放在返回值为空的函数中，需导入 `os` 和 `fmt`。追加写入可使用 `os.OpenFile(path, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)`，打开后 `defer f.Close()`。

### 排序

```go
nums := []int{5, 2, 9}
slices.Sort(nums)
slices.SortFunc(users, func(a, b User) int {
    return cmp.Compare(a.Age, b.Age)
})
```

需导入 `slices` 和 `cmp`；此处 `users` 是 `[]User`，`User` 有 `Age int` 字段。`slices.SortFunc` 需要 Go 1.21+。

## 12. 泛型

```go
package main
import "fmt"

type Number interface { ~int | ~int64 | ~float64 }
func Add[T Number](a, b T) T { return a + b }

type Response[T any] struct {
    Code int `json:"code"`
    Data T `json:"data"`
}

func First[T any](items []T) (T, bool) {
    if len(items) == 0 {
        var zero T
        return zero, false
    }
    return items[0], true
}

func main() {
    fmt.Println(Add(1, 2))
    fmt.Println(First([]string{"a", "b"}))
    fmt.Println(Response[string]{Code: 200, Data: "ok"})
}
```

`~int` 表示底层类型为 `int` 的类型集合。Go 泛型用于可复用容器、算法与类型安全的通用工具；不必把每个业务函数都泛型化。

## 13. Goroutine、Channel、锁与 Context

### 等待 Goroutine

```go
package main
import (
    "fmt"
    "sync"
)
func main() {
    var wg sync.WaitGroup
    for i := 0; i < 3; i++ {
        wg.Add(1)
        go func(n int) {
            defer wg.Done()
            fmt.Println("worker", n)
        }(i)
    }
    wg.Wait()
}
```

### Channel

```go
ch := make(chan int, 2)
ch <- 10
ch <- 20
fmt.Println(<-ch)
close(ch)
for v := range ch { fmt.Println(v) }
```

关闭后可以读取剩余缓冲值；向已关闭 Channel 发送会 panic。通常由发送方关闭 Channel，接收方不应随意关闭。

### 共享数据加锁

```go
type Counter struct {
    mu sync.Mutex
    value int
}
func (c *Counter) Inc() {
    c.mu.Lock()
    defer c.mu.Unlock()
    c.value++
}
```

### Context 超时

```go
ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
defer cancel()
select {
case <-ctx.Done():
    fmt.Println(ctx.Err())
}
```

上述独立片段需要导入 `fmt`、`sync`、`context`、`time` 中各自使用的包。`go test -race ./...` 可帮助检测数据竞争。

## 14. HTTP 与 Gin CRUD 示例

这是一个**可直接运行的内存版用户 CRUD API**，使用 Gin，包含参数校验、并发锁和 HTTP 状态码。重启后数据会丢失；生产环境应换成数据库存储。

初始化：

```bash
mkdir gin-crud && cd gin-crud
go mod init example.com/gin-crud
go get github.com/gin-gonic/gin
```

创建 `main.go`：

```go
package main

import (
    "net/http"
    "strconv"
    "sync"

    "github.com/gin-gonic/gin"
)

type User struct {
    ID   int    `json:"id"`
    Name string `json:"name" binding:"required"`
    Age  int    `json:"age" binding:"gte=0"`
}

type UserInput struct {
    Name string `json:"name" binding:"required"`
    Age  int    `json:"age" binding:"gte=0"`
}

func main() {
    r := gin.Default()
    var mu sync.RWMutex
    users := make(map[int]User)
    nextID := 1

    r.POST("/users", func(c *gin.Context) {
        var input UserInput
        if err := c.ShouldBindJSON(&input); err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
            return
        }
        mu.Lock()
        user := User{ID: nextID, Name: input.Name, Age: input.Age}
        users[nextID] = user
        nextID++
        mu.Unlock()
        c.JSON(http.StatusCreated, user)
    })

    r.GET("/users", func(c *gin.Context) {
        mu.RLock()
        result := make([]User, 0, len(users))
        for _, u := range users { result = append(result, u) }
        mu.RUnlock()
        c.JSON(http.StatusOK, result) // 顺序不固定
    })

    r.GET("/users/:id", func(c *gin.Context) {
        id, err := strconv.Atoi(c.Param("id"))
        if err != nil || id <= 0 {
            c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
            return
        }
        mu.RLock()
        user, ok := users[id]
        mu.RUnlock()
        if !ok {
            c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
            return
        }
        c.JSON(http.StatusOK, user)
    })

    r.PUT("/users/:id", func(c *gin.Context) {
        id, err := strconv.Atoi(c.Param("id"))
        if err != nil || id <= 0 {
            c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
            return
        }
        var input UserInput
        if err := c.ShouldBindJSON(&input); err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
            return
        }
        mu.Lock()
        _, ok := users[id]
        if ok { users[id] = User{ID: id, Name: input.Name, Age: input.Age} }
        mu.Unlock()
        if !ok {
            c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
            return
        }
        c.JSON(http.StatusOK, User{ID: id, Name: input.Name, Age: input.Age})
    })

    r.DELETE("/users/:id", func(c *gin.Context) {
        id, err := strconv.Atoi(c.Param("id"))
        if err != nil || id <= 0 {
            c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
            return
        }
        mu.Lock()
        _, ok := users[id]
        if ok { delete(users, id) }
        mu.Unlock()
        if !ok {
            c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
            return
        }
        c.Status(http.StatusNoContent)
    })

    if err := r.Run(":8080"); err != nil { panic(err) }
}
```

启动和测试：

```bash
go run .
curl -X POST http://localhost:8080/users -H 'Content-Type: application/json' -d '{"name":"Tom","age":18}'
curl http://localhost:8080/users
curl http://localhost:8080/users/1
curl -X PUT http://localhost:8080/users/1 -H 'Content-Type: application/json' -d '{"name":"Tom","age":20}'
curl -X DELETE http://localhost:8080/users/1
```

Windows PowerShell 建议使用 `curl.exe`，以避免旧版 PowerShell 中 `curl` 别名行为差异。

进一步扩展：将 `users` Map 替换为 MySQL，使用 `database/sql` 或 GORM；拆分 handler/service/repository；增加分页、筛选、参数验证、单元测试和事务。

## 15. 测试、常用命令和常见坑

`math.go`：

```go
package main
func Add(a, b int) int { return a + b }
```

`math_test.go`：

```go
package main
import "testing"
func TestAdd(t *testing.T) {
    if got := Add(2, 3); got != 5 {
        t.Fatalf("Add(2,3)=%d; want 5", got)
    }
}
```

```bash
go test ./...
go test -v ./...
go test -race ./...
go test -cover ./...
go fmt ./...
go vet ./...
```

常见坑：

1. `:=` 只能在函数内部使用，且左侧至少有一个新变量。
2. 未使用的局部变量和导入会导致编译错误。
3. Go 的 `if` 只接受 bool，不会自动做 JavaScript 式真值转换。
4. `nil` Map 不能写入；Map 遍历顺序不稳定。
5. Slice 截取共享底层数组，`append` 后可能扩容。
6. `len(string)` 是字节数，不是中文字符数。
7. `range` 返回的 Slice 元素值是副本，修改结构体应使用索引 `items[i].Field = ...`。
8. 接口值可能包含一个非 nil 的具体类型指针，此时接口本身不等于 `nil`。
9. 并发访问普通 Map 可能发生数据竞争甚至运行时错误。
10. `defer` 不是异步，Goroutine 也不是 Promise。
11. 整数除法会截断小数部分。
12. Go 没有异常式 `try/catch` 处理普通业务错误。

## 16. JavaScript / TypeScript 对照表


| JS / TS | Go | 注意 |
| ---------------------- | ------------------------------ | ----------------- |
| `let x = 1` | `x := 1` | 仅函数内部 |
| `const x = 1` | `const x = 1` | Go 常量需编译期可确定 |
| `number` | `int`、`float64` 等 | 类型更细 |
| `boolean` | `bool` | 不做隐式真值转换 |
| `null` | `nil` | 仅部分类型支持 |
| `arr.push(v)` | `arr = append(arr, v)` | 需要接收返回值 |
| `arr.splice(i,1)` | `slices.Delete(arr,i,i+1)` | Go 1.21+ |
| `arr.includes(v)` | `slices.Contains(arr,v)` | Go 1.21+ |
| `arr.findIndex(fn)` | `slices.IndexFunc(arr,fn)` | Go 1.21+ |
| `arr.slice(a,b)` | `arr[a:b]` | 共享底层数组 |
| `obj[key] = v` | `m[key] = v` | Map 初始化后才能写 |
| `delete obj[key]` | `delete(m,key)` | 删除 Map 键 |
| `for (const x of arr)` | `for _,x := range arr` | 值是副本 |
| `function f(){}` | `func f(){}` | 参数和返回值显式类型 |
| `(x)=>x*2` | `func(x int) int {return x*2}` | 匿名函数 |
| `class` | `struct` + 方法 | 不同于类继承 |
| `implements` | 隐式实现 interface | 无需显式声明 |
| `try/catch` | `if err != nil` | 多返回值 |
| `JSON.stringify` | `json.Marshal` | 返回 `[]byte,error` |
| `JSON.parse` | `json.Unmarshal` | 需要目标地址 |
| `Promise.all` | Goroutine + WaitGroup 等 | 并非完全等价 |


## 17. 七天学习路线与练习

- **第 1 天：** 环境、变量、类型、运算符、if、for、switch。练习：命令行计算器。
- **第 2 天：** Array、Slice、Map、字符串 CRUD。练习：通讯录增删改查。
- **第 3 天：** 函数、指针、Struct、方法、Interface。练习：封装用户管理服务。
- **第 4 天：** error、defer、JSON、文件与包。练习：用户数据保存到 JSON 文件。
- **第 5 天：** 泛型、Goroutine、Channel、Mutex、Context。练习：并发统计任务。
- **第 6 天：** Gin 路由、参数、请求体、状态码。练习：运行本手册 Gin CRUD。
- **第 7 天：** MySQL、分层设计、测试。练习：将内存 CRUD 改造成数据库 CRUD。

### 进阶实践清单

- Slice 按 ID 查找、插入、更新和删除结构体
- Map 按键查找、判断存在、更新、删除
- 用 `(value, error)` 设计函数返回值
- 用指针接收者更新 Struct
- JSON 与 Struct 双向转换
- 使用 Gin 编写 5 个 REST API
- 使用 `go test` 为服务编写测试
- 使用 `go test -race` 检测并发问题
- 接入数据库并处理唯一约束、事务与分页

### 官方参考资料

- [Go Tour](https://go.dev/tour/)
- [Go by Example](https://gobyexample.com/)
- [Effective Go](https://go.dev/doc/effective_go)
- [Go 语言规范](https://go.dev/ref/spec)
- [标准库文档](https://pkg.go.dev/std)
- [Gin 官方文档](https://gin-gonic.com/en/docs/)

---

**建议使用方式：** 将本 Markdown 文件放进 VS Code，按章节边读边敲；第 6～7 天把 Gin CRUD 作为一个独立仓库维护。文中有些短片段为语法演示，需要放在函数内部并导入对应包；完整 `package main` 示例和 Gin CRUD 示例可单独运行。