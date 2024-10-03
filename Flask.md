# Flask



## basic

https://tutorial.helloflask.com



### Hello, Flask



```python
from flask import Flask

app = Flask(__name__)

@app.route('/home')
@app.route('/index')
@app.route('/')
def hello():
    return 'Welcome to My Watchlist!'
```

`flask run`

`flask run --debug` 调试模式开启后，当程序出错，浏览器页面上会显示错误信息；代码出现变动后，程序会自动重载。



**注册处理函数**

```python
@app.route('/')
def hello():
    return 'Welcome to My Watchlist!'
```

- 注册一个处理函数，Flask 官方称其为 视图函数 (*View Function*) 

- 注册？ 即给该函数戴上一个装饰器帽子

  `app.route() `装饰器为该函数绑定对应的 URL, 用户在浏览器访问该 URL 时，就会触发这个函数，获取返回值并显示到浏览器窗口

- 为便于理解，可以把 Web 程序视为一堆这样的视图函数的集合：编写不同的函数处理对应 URL 的请求



**修改视图函数名**

视图函数的名字是自由定义的，和 URL 规则无关。和定义其他函数或变量一样，只需要让它表达出所要处理页面的含义即可。

除此之外，它还有一个重要的作用：作为代表某个路由的端点( endpoint ) , 同时用来生成视图函数对应的 URL， 对于程序内的 URL，为了避免手写，Flask 提供了一个 `url_for` 函数来生成 URL，它接受的第一个参数就是端点值，默认为视图函数的名称：



**整个请求的处理过程如下所示：**

1. 当用户在浏览器地址栏访问这个地址，在这里即 http://localhost:5000/
2. 服务器解析请求，发现请求 URL 匹配的 URL 规则是 `/`，因此调用对应的处理函数 `hello()`
3. 获取 `hello()` 函数的返回值，处理后返回给客户端（浏览器）
4. 浏览器接受响应，将其显示在窗口上



**在 URL 里定义变量部分：**

```python
@app.route('/user/<name>')
def user_page(name):
    return 'User page'
```

>**注意**  ：用户输入的数据会包含恶意代码，所以不能直接作为响应返回，需要使用 **MarkupSafe**（Flask 的依赖之一）提供的 `escape()` 函数对 `name` 变量进行转义处理，比如把 `<` 转换成 `$lt`。这样在返回响应时浏览器就不会把它们当做代码执行。







#### 程序发现机制

这是因为 Flask 默认会假设你把程序存储在名为 app.py 或 wsgi.py 的文件中。如果你使用了其他名称，就要设置系统环境变量 `FLASK_APP` 来告诉 Flask 你要启动哪个程序：`> set FLASK_APP=hello.py`







### 模板



**模板**：包含变量和运算逻辑的HTML或其他格式的文本

**渲染**：执行这些变量替换和逻辑计算工作的过程 , 模版渲染引擎：Jinja2

```Jinja2
{{ ... }} {#用来标记变量#}

{% ... %} {#用来标记语句，如 if, for 等#}

{#  用来写注释 #}

<h1> {{ username }} 的个人主页 </h1>
{% if bio %}
	<p>{{ bio }}</p> {# 这里的缩进只是为了可读性，不是必须得 #}
{% else %}
	<p> 自我介绍为空 </p>
{% endif %} {# 大部分 Jinja 语句都需要声明关闭 #}
```



为了方便对变量进行处理，Jinja2 提供了一些过滤器，语法形式：

```Jinja2
{{ 变量|过滤器 }}
```

比如，上面的模板里使用 `length` 过滤器来获取 `movies` 的长度，类似 Python 里的 `len()` 函数。

 https://jinja.palletsprojects.com/en/3.0.x/templates/#builtin-filters



按照默认的设置， Flask 会从程序实例所在模块同级目录的 templates 文件夹中寻找模板



#### 渲染主页模板

使用 `render_template()` 函数可以把模板渲染出来，必须传入的参数为模板文件名

为了让模板正确渲染，我们还要把模板内部使用的变量通过关键字参数传入这个函数

```python
# app.py

@app.route('/')
def index():
	return render_template('index.html', name=name, movies=movies)
```

`render_template()` 函数在调用时会识别并执行 index.html 里所有的 Jinja2 语句，返回渲染好的模板内容。在返回的页面中，变量会被替换为实际的值（包括定界符），语句（及定界符）则会在执行后被移除（注释也会一并移除）













### 静态文件



静态文件和模板的概念相反，指的是内容不需要动态生成的文件，如：图片、CSS文件、JavaScript脚本等



在 Flask 中，创建static文件夹来保存静态文件，和程序模块，templates文件夹在同一目录层级



#### 静态文件 URL



在 HTML文件中，引入静态文件需要给出资源所在的 URL, 可以通过 Flask 提供的 `url_for` 函数生成

`url_for` 函数：传入端点值(视图函数的名称)和参数，返回对应的 URL

对于静态文件，需要传入的端点值是 `static`，同时使用 `filename` 参数来传入相对于 static 文件夹的文件路径。

```Jinja2
<img src="{{ url_for('static', filename='foo.jpg')}}">
{# 花括号部分的调用会返回 /static/foo.jpg #}
```





### 数据库



借助 SQLAIchemy，可以通过定义python类来表示数据库里的一张表(类属性表示表中的字段/列)，通过对这个类进行各种操作来代替写 SQL 语句。

这个类被称为 ：***模型类***， 类中的属性称为：***字段***





#### 设置数据库 URI



设置和定义一些配置变量。Flask提供了一个统一的接口来写入和获取这些配置变量：`Flask.config` 字典。配置变量的名称必须使用大写

写入配置的语句一般放到扩展类实例化语句之前。

```python
import os
import sys

from flask import Flask
from flask_sqlalchemy import SQLAlchemy

WIN = sys.platform.startswith('win')
if WIN:  # 如果是 Windows 系统，使用三个斜线
    prefix = 'sqlite:///'
else:  # 否则使用四个斜线
    prefix = 'sqlite:////'

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = prefix + os.path.join(app.root_path, 'data.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # 关闭对模型修改的监控
# 在扩展类实例化前加载配置
db = SQLAlchemy(app)
```





#### 创建数据库模型

```python
class User(db.Model):  # 表名将会是 user（自动生成，小写处理）
    id = db.Column(db.Integer, primary_key=True)  # 主键
    name = db.Column(db.String(20))  # 名字


class Movie(db.Model):  # 表名将会是 movie
    id = db.Column(db.Integer, primary_key=True)  # 主键
    title = db.Column(db.String(60))  # 电影标题
    year = db.Column(db.String(4))  # 电影年份
```

- 模型类要声明继承：`db.Model`

- 每一个类属性(字段)要实例化 `db.Column` , 传入的参数为字段的类型。

- `db.Column` 中可选的参数：

  `primary_key` 设置当前字段是否为主键。除此之外，常用的选项还有 `nullable`（布尔值，是否允许为空值）、`index`（布尔值，是否设置索引）、`unique`（布尔值，是否允许重复值）、`default`（设置默认值）等。



#### 读取

```jinja2
<模型类>.query<过滤方法(可选)>.<查询方法>
```









### 模板优化





#### 模板上下文处理函数



对于多个模板内都需要使用的变量，我们可以用 `app.context_processor` 装饰器注册一个模板上下文处理函数：

```python
@app.context_processor
def inject_user():
    user = User.query.first()
    return dict(user=user)
```

这个函数返回的变量（以字典键值对的形式）将会统一注入到每一个模板的上下文环境中，因此可以直接在模板中使用。





#### 模板继承

我们可以定义一个父模板，一般会称之为基模板（base template）。基模板中包含完整的 HTML 结构和导航栏、页首、页脚等通用部分。在子模板里，我们可以使用 `extends` 标签来声明继承自某个基模板

基模板中需要在实际的自模版中追加或重写的部分可以定义为块 ：

```jinja2
{% block 块名称 %}

{% endblock 块名称 %}
```

通过在子模板里定义一个同样名称的块，你可以向基模板的对应块位置追加或重写内容。
