window.lessonDetails = {
  1: {
    title: "信号、采样与音频 I/O",
    subtitle: "把声音从物理量、采样点、文件格式、实时帧处理四个层面打通。",
    objective: "学完这一周，你要能解释一个 WAV 文件里的每个 sample 从哪里来、代表什么、会怎样进入实时算法链路。",
    mentalModel: "音频算法不是处理“声音”这个抽象词，而是在固定采样率、位宽、通道数、帧长和延迟预算下处理一串数字。",
    sections: [
      {
        title: "核心概念",
        items: [
          "连续信号 x(t) 经过 ADC 变成离散序列 x[n]，采样率 Fs 决定时间分辨率和最高可表达频率。",
          "Nyquist 频率是 Fs/2，高于它的频率会折叠成低频混叠，所以录音链路必须有模拟或数字抗混叠滤波。",
          "PCM sample 通常是 int16、int24、float32。int16 的满幅是 [-32768, 32767]，算法内部常转成 [-1, 1] float。",
          "dBFS 描述相对数字满幅的电平，dB SPL 描述物理声压级。会议音频调试时不要把两者混用。",
          "实时处理通常按 10 ms 或 20 ms 分帧：16 kHz 下 10 ms 是 160 点，48 kHz 下 10 ms 是 480 点。"
        ]
      },
      {
        title: "工程直觉",
        items: [
          "算法听起来断续，第一反应检查 frame drop、buffer underrun、采样率不一致和通道顺序。",
          "一个模块每帧只多 2 ms 计算，串 5 个模块就可能吃掉实时预算。",
          "远端参考信号、麦克风信号、播放信号必须在同一时间基准下看，否则 AEC 延迟估计会变成玄学。"
        ]
      },
      {
        title: "建议学习顺序",
        items: [
          "先读 WAV header：RIFF、fmt、data、sample rate、bits per sample、channels。",
          "再写归一化：int16 <-> float32，并检查 clipping。",
          "最后把单文件处理改成流式帧处理，观察帧长对延迟和统计稳定性的影响。"
        ]
      }
    ],
    formulas: [
      "采样周期：Ts = 1 / Fs",
      "Nyquist 频率：Fmax = Fs / 2",
      "数字峰值电平：dBFS = 20 log10(max(|x[n]|) / full_scale)",
      "RMS：sqrt(mean(x[n]^2))",
      "10 ms 帧长：N = Fs * 0.01"
    ],
    lab: {
      title: "WAV 读写与基础统计",
      steps: [
        "读入 mono/stereo WAV，打印 Fs、通道数、时长、位宽、peak、RMS、DC offset。",
        "把 1 kHz sine 分别保存成 -3 dBFS、-12 dBFS、clip 三个版本，听差异并画波形。",
        "将 48 kHz 音频错误按 16 kHz 播放，记录音调和时长变化，建立采样率错误的直觉。",
        "实现 10 ms 分帧，输出每帧 RMS 曲线。"
      ],
      output: "一份 `wav_inspect` 工具，加 3 张图：波形、RMS 曲线、clipping 标记。"
    },
    pitfalls: [
      "只看波形不看电平单位，导致算法参数在不同输入增益下完全失效。",
      "忘记处理 stereo interleaved 布局，把左右声道当成连续时间点。",
      "把 int16 直接相乘不转 float，溢出后得到荒唐结果。"
    ],
    questions: [
      "16 kHz 和 48 kHz 对会议语音各有什么优缺点？",
      "为什么 AEC/NS 常用 10 ms 帧？",
      "dBFS 和 dB SPL 的换算为什么需要校准？"
    ],
    resources: [
      { label: "MIT Signals and Systems", url: "https://ocw.mit.edu/courses/res-6-007-signals-and-systems-spring-2011/", note: "先看采样和系统响应相关内容。" },
      { label: "WAVE PCM soundfile format", url: "http://soundfile.sapp.org/doc/WaveFormat/", note: "查 WAV header 很方便。" }
    ]
  },
  2: {
    title: "卷积、相关、FFT 与 STFT",
    subtitle: "把时域卷积、频域乘法、相关延迟估计和短时谱处理连起来。",
    objective: "能手写 STFT/ISTFT，知道窗函数和 hop 如何影响泄漏、重构和实时延迟。",
    mentalModel: "卷积是系统作用，相关是对齐相似性，FFT 是快速换视角，STFT 是把非平稳音频切成短时间近似平稳片段。",
    sections: [
      {
        title: "核心概念",
        items: [
          "线性卷积描述输入经过 LTI 系统后的输出：y[n] = sum_k x[k]h[n-k]。",
          "互相关 Rxy[m] 衡量 x 与 y 延迟 m 时的相似度，是 TDOA 和延迟估计的基础。",
          "DFT 把有限长序列投影到复指数基上，幅度表示能量分布，相位表示时间结构。",
          "窗函数降低截断带来的旁瓣泄漏，但会牺牲主瓣宽度；没有免费的窗。",
          "STFT 用窗长决定频率分辨率，用 hop 决定时间步进和重叠开销。"
        ]
      },
      {
        title: "工程直觉",
        items: [
          "语音增强通常在 STFT 域估计增益或 mask，因为噪声和语音的频谱结构更容易分开。",
          "AEC 的频域分块自适应滤波，本质是用 FFT 加速长 FIR 卷积。",
          "定位算法的 GCC-PHAT 是相关的频域实现，靠相位信息估计延迟峰。"
        ]
      },
      {
        title: "建议学习顺序",
        items: [
          "先手写直接卷积和 FFT 卷积，比较计算量。",
          "再实现 STFT 和 overlap-add 重构，确认重构误差接近数值精度。",
          "最后用互相关估计两路信号延迟，加入噪声和混响看峰值变化。"
        ]
      }
    ],
    formulas: [
      "线性卷积：y[n] = sum_k x[k] h[n-k]",
      "互相关：Rxy[m] = sum_n x[n] y[n+m]",
      "DFT：X[k] = sum_n x[n] exp(-j2*pi*k*n/N)",
      "Parseval：sum_n |x[n]|^2 = (1/N) sum_k |X[k]|^2",
      "COLA 条件：sum_m w[n-mH] = constant"
    ],
    lab: {
      title: "STFT/ISTFT 与延迟估计",
      steps: [
        "实现 Hann 窗 STFT，并输出 magnitude spectrogram。",
        "实现 ISTFT overlap-add，测试不同 hop 下的重构误差。",
        "生成一个延迟 80 samples 的双路信号，用互相关找到延迟。",
        "加入白噪声和房间混响，观察相关峰变宽、变矮、出现伪峰。"
      ],
      output: "一份 STFT notebook：窗函数对比、重构误差表、延迟估计图。"
    },
    pitfalls: [
      "直接把幅度谱改完做 ISTFT，却忘记保留原相位。",
      "窗和 hop 不满足重构条件，导致输出有周期性音量起伏。",
      "用 circular convolution 当 linear convolution，尾部绕回污染结果。"
    ],
    questions: [
      "为什么频率分辨率和时间分辨率不能同时无限好？",
      "Hann 窗和矩形窗的听感差别可能体现在哪里？",
      "互相关峰值不明显时有哪些可能原因？"
    ],
    resources: [
      { label: "MIT Digital Signal Processing", url: "https://ocw.mit.edu/courses/res-6-008-digital-signal-processing-spring-2011/", note: "重点看 DFT、FFT、LTI 系统。" },
      { label: "Spectral Audio Signal Processing", url: "https://ccrma.stanford.edu/~jos/sasp/", note: "窗函数和 STFT 解释非常适合音频方向。" }
    ]
  },
  3: {
    title: "滤波器、z 变换与多速率",
    subtitle: "从频响设计到实时状态维护，建立滤波器的工程手感。",
    objective: "能设计、实现、评估 FIR/IIR，并理解重采样和群延迟对实时链路的影响。",
    mentalModel: "滤波器就是你对频率和相位的选择，真实产品里还要付出延迟、计算量、稳定性和数值精度成本。",
    sections: [
      {
        title: "核心概念",
        items: [
          "FIR 只有零点，天然稳定，容易做线性相位，但阶数可能很高。",
          "IIR 有极点和零点，低阶可得到陡峭频响，但相位非线性且稳定性依赖极点位置。",
          "z 变换让差分方程、系统函数、零极点和频响统一在一个框架里。",
          "群延迟是相位对频率的导数，会影响语音瞬态和多模块同步。",
          "多速率处理包括抽取、插值和重采样，必须先低通防止混叠。"
        ]
      },
      {
        title: "工程直觉",
        items: [
          "会议上行常有 HPF 去低频震动和风噪，但截止频率太高会让男声变薄。",
          "AEC 回声路径中包含扬声器、房间、麦克风和滤波器的综合响应，任何额外滤波都会改变路径。",
          "重采样质量差会在高频引入别名，深度模型训练和推理采样率不一致会明显退化。"
        ]
      },
      {
        title: "建议学习顺序",
        items: [
          "从差分方程实现一阶 IIR，画零极点和频响。",
          "用窗函数法设计 FIR，再用双线性变换设计 IIR。",
          "实现 48 kHz -> 16 kHz 的重采样，比较 naive decimate 和 polyphase。"
        ]
      }
    ],
    formulas: [
      "FIR：y[n] = sum_{k=0}^{M} b[k] x[n-k]",
      "IIR：y[n] = sum_k b[k]x[n-k] - sum_k a[k]y[n-k]",
      "系统函数：H(z) = Y(z) / X(z)",
      "稳定条件：所有极点位于单位圆内",
      "群延迟：tau_g(w) = - d phi(w) / d w"
    ],
    lab: {
      title: "语音前端滤波器",
      steps: [
        "设计 80 Hz HPF、300-3400 Hz band-pass、7 kHz low-pass。",
        "分别用 FIR 和 IIR 实现，比较幅频、相频、群延迟、阶数和 CPU。",
        "对语音样例滤波，听男声厚度、齿音、噪声残留变化。",
        "实现流式处理状态保存，验证分块处理和整段处理结果一致。"
      ],
      output: "滤波器设计脚本、频响图、分块一致性测试。"
    },
    pitfalls: [
      "每帧重新初始化 IIR 状态，导致边界爆音。",
      "只看幅频不看相位，阵列多通道信号相位被破坏。",
      "抽取前没低通，混叠后再也无法从数字域恢复。"
    ],
    questions: [
      "为什么阵列处理更偏爱线性相位或严格一致的通道响应？",
      "IIR 在定点实现时最担心什么？",
      "重采样会如何影响 AEC 的 delay estimator？"
    ],
    resources: [
      { label: "MIT DSP - z Transform", url: "https://ocw.mit.edu/courses/res-6-008-digital-signal-processing-spring-2011/", note: "看零极点和滤波器章节。" },
      { label: "SciPy Signal", url: "https://docs.scipy.org/doc/scipy/reference/signal.html", note: "工程实验可先用 scipy.signal 做参照。" }
    ]
  },
  4: {
    title: "随机信号、噪声与实时工程",
    subtitle: "理解噪声的统计描述，以及实时音频代码为什么会因为小细节崩掉。",
    objective: "能估计 PSD、相干函数和 SNR，并写出稳定的分帧实时处理框架。",
    mentalModel: "传统音频算法大量依赖统计估计；实时系统大量依赖状态、缓冲和时序。",
    sections: [
      {
        title: "核心概念",
        items: [
          "白噪声功率谱近似平坦，粉噪低频能量更强，真实办公室噪声通常是非平稳混合噪声。",
          "PSD 描述信号功率在频率上的分布，是降噪估计噪声底的基础。",
          "互功率谱和相干函数能判断两个通道在某频段是否来自同一声源或同一路径。",
          "定点实现需要关注动态范围、缩放、饱和和舍入噪声。",
          "实时音频回调不能做阻塞 IO、内存大分配或不确定耗时操作。"
        ]
      },
      {
        title: "工程直觉",
        items: [
          "VAD 错、噪声估计错、AEC 双讲判断错，本质都常是统计假设被场景破坏。",
          "环形缓冲区是连接采集、播放、算法线程的关键；溢出和欠载都会变成听得见的问题。",
          "线上偶发爆音常不是算法公式错，而是边界状态、溢出、线程调度或 buffer 生命周期错。"
        ]
      }
    ],
    formulas: [
      "自相关：Rxx[m] = E{x[n]x[n+m]}",
      "功率谱：Sxx(w) = DTFT{Rxx[m]}",
      "Welch PSD：分帧加窗 periodogram 后平均",
      "相干函数：Cxy(f)=|Sxy(f)|^2/(Sxx(f)Syy(f))",
      "SNR = 10 log10(P_signal / P_noise)"
    ],
    lab: {
      title: "噪声统计与 ring buffer",
      steps: [
        "收集空调声、键盘声、人声、音乐片段，估计短时 PSD。",
        "用 Welch 方法比较不同窗长下 PSD 的平滑程度。",
        "写一个环形缓冲区，模拟 producer/consumer 速率微小不一致。",
        "用 Q15 实现增益乘法，观察溢出、截断和饱和。"
      ],
      output: "噪声 PSD 图、相干函数图、ring buffer 压测日志。"
    },
    pitfalls: [
      "用单帧谱当作稳定噪声估计，结果剧烈抖动。",
      "没有 DC removal，低频统计被偏置污染。",
      "在音频回调里写日志或分配大对象，造成随机卡顿。"
    ],
    questions: [
      "为什么非平稳噪声比白噪声更难降？",
      "相干函数在多麦克风处理中能帮你判断什么？",
      "定点 Q 格式的 headroom 应该怎么留？"
    ],
    resources: [
      { label: "Spectral Audio Signal Processing", url: "https://ccrma.stanford.edu/~jos/sasp/", note: "看 spectrum analysis 和 noise 相关章节。" },
      { label: "WebRTC Audio Processing", url: "https://webrtc.googlesource.com/src/+/refs/heads/main/modules/audio_processing/", note: "观察工业代码的帧处理组织方式。" }
    ]
  },
  5: {
    title: "语音产生、听感与基础特征",
    subtitle: "让你能从语音结构和听觉感知解释算法效果。",
    objective: "能解释基频、共振峰、梅尔谱、VAD 特征和听感失真之间的关系。",
    mentalModel: "语音是有结构的声源-声道信号，人耳也不是频谱仪；算法优化最终要服务听感和可懂度。",
    sections: [
      {
        title: "核心概念",
        items: [
          "声带振动产生基频 F0，声道形状形成共振峰 formant。",
          "元音更稳定、能量更强；辅音和爆破音更短、更容易被降噪吞掉。",
          "Mel 频率符合人耳低频分辨率高、高频分辨率低的特点。",
          "MFCC 是对 Mel 滤波器组能量取 log 后做 DCT，传统语音识别和 VAD 常用。",
          "响度、掩蔽、临界带决定了客观频谱差异不一定等于主观听感差异。"
        ]
      },
      {
        title: "工程直觉",
        items: [
          "降噪模型吞字，通常先听辅音、尾音、弱语音和双讲场景。",
          "AGC 太激进会把背景噪声一起抬起来，让 NS 更难工作。",
          "VAD 不是一个小模块，它会影响噪声估计、AEC 双讲、AGC、编码和省电策略。"
        ]
      }
    ],
    formulas: [
      "Mel 近似：mel(f)=2595 log10(1+f/700)",
      "短时能量：E = sum_n x[n]^2",
      "过零率：ZCR = count(sign changes) / N",
      "谱质心：sum_k f_k |X[k]| / sum_k |X[k]|",
      "谱熵：-sum_k p_k log(p_k)"
    ],
    lab: {
      title: "语音特征可视化",
      steps: [
        "录制男声、女声、键盘声、风扇声，画波形、谱图、Mel 谱。",
        "提取能量、ZCR、谱熵、谱质心，观察语音和噪声的分布。",
        "写一个能量+谱熵 VAD baseline，并统计误检/漏检。",
        "专门挑弱语音和键盘声测试，记录失败原因。"
      ],
      output: "VAD baseline、特征分布图、失败样例列表。"
    },
    pitfalls: [
      "只用能量做 VAD，近讲键盘声和远讲弱语音都会误判。",
      "只看 PESQ/STOI，不听辅音细节。",
      "把音乐、笑声、咳嗽都当噪声处理，产品体验会很糟。"
    ],
    questions: [
      "为什么弱辅音容易被降噪吃掉？",
      "MFCC 为什么先取 log？",
      "会议产品里的 VAD 和语音识别里的 VAD 目标有什么不同？"
    ],
    resources: [
      { label: "Speech and Audio Signal Processing 方向资料入口", url: "https://ccrma.stanford.edu/~jos/sasp/", note: "用作语音频谱和听感补充。" },
      { label: "librosa feature docs", url: "https://librosa.org/doc/latest/feature.html", note: "快速实验语音特征。" }
    ]
  },
  6: {
    title: "房间声学与回声路径",
    subtitle: "把会议室、扬声器、麦克风和回声路径看成一个真实系统。",
    objective: "能用 RIR 生成回声/混响数据，并解释 RT60、DRR、非线性和安装结构对算法的影响。",
    mentalModel: "AEC 不是消除一条延迟线，而是在跟踪扬声器到麦克风之间随环境变化的声学系统。",
    sections: [
      {
        title: "核心概念",
        items: [
          "RIR 是房间对脉冲的响应，包含直达声、早期反射和晚期混响。",
          "RT60 表示声能衰减 60 dB 所需时间，越大说明混响越重。",
          "DRR 是直达声和混响声能比，会影响定位和语音清晰度。",
          "扬声器非线性、限幅、桌面振动会产生传统线性 AEC 难以抵消的残余回声。",
          "麦克风位置误差、遮挡、腔体结构会改变阵列相位和幅度一致性。"
        ]
      },
      {
        title: "工程直觉",
        items: [
          "会议室越大、混响越长，AEC 收敛越慢，残余回声越拖尾。",
          "设备外壳和桌面反射会让理论阵列几何不再等于实际阵列响应。",
          "真实调试要同时听 near-end、far-end、mic、aec out，不能只看最后输出。"
        ]
      }
    ],
    formulas: [
      "麦克风信号简化：d[n] = s_near[n] + h[n] * x_far[n] + v[n]",
      "DRR = 10 log10(E_direct / E_reverb)",
      "Sabine 近似：RT60 = 0.161 V / A",
      "回声路径长度约：L >= RT60 * Fs 的有效尾部截断",
      "声速近似：c = 343 m/s at 20C"
    ],
    lab: {
      title: "RIR 合成回声数据",
      steps: [
        "用 image source method 或 pyroomacoustics 生成不同 RT60 的 RIR。",
        "将 far-end 语音与 RIR 卷积得到 echo，再加 near-end 和噪声。",
        "比较 RT60=0.2s、0.6s、1.0s 下 AEC 难度和听感。",
        "加入 clipping 或 tanh 非线性，观察传统 AEC 残余。"
      ],
      output: "一组可复用 AEC/NS/DOA 合成数据脚本。"
    },
    pitfalls: [
      "只用干净近讲数据训练或调参，实际会议室马上崩。",
      "忽略扬声器播放链路延迟，把算法延迟估计怪到 AEC 本身。",
      "阵列仿真只做理想几何，不加通道增益和相位误差。"
    ],
    questions: [
      "RT60 对 AEC 和 DOA 分别造成什么问题？",
      "为什么非线性回声不能被线性自适应滤波完全消掉？",
      "怎么设计一个接近真实会议室的数据增强流程？"
    ],
    resources: [
      { label: "Pyroomacoustics", url: "https://pyroomacoustics.readthedocs.io/", note: "房间仿真、RIR、阵列实验都能用。" },
      { label: "Room Impulse Response Generator", url: "https://www.audiolabs-erlangen.de/fau/professor/habets/software/rir-generator", note: "经典 RIR 仿真工具入口。" }
    ]
  },
  7: {
    title: "音质指标、主观测试与实验设计",
    subtitle: "建立能指导调参和版本决策的评测体系。",
    objective: "能解释 ERLE、STOI、PESQ、POLQA、MOS、DNSMOS/AECMOS 的适用边界。",
    mentalModel: "指标是雷达，不是驾驶员；最终要用场景、听感和工程目标一起判断。",
    sections: [
      {
        title: "核心概念",
        items: [
          "ERLE 衡量回声消除量，但高 ERLE 不代表 near-end 没有失真。",
          "STOI 更关注可懂度，PESQ/POLQA 更接近语音质量，但都有使用条件和授权限制。",
          "P.835 把语音质量、噪声质量、整体质量拆开，适合语音增强听测。",
          "P.808 提供众包主观评测流程，适合大规模收集 MOS。",
          "DNSMOS/AECMOS 是模型预测分数，适合批量筛选，不能替代关键样例人工听。"
        ]
      },
      {
        title: "工程直觉",
        items: [
          "降噪版本常出现：噪声少了但语音更闷。单一指标很容易误导。",
          "AEC 版本要同时看 echo return、double-talk、near-end distortion、convergence。",
          "测试集必须按场景分桶，否则平均分会掩盖严重退化场景。"
        ]
      }
    ],
    formulas: [
      "ERLE[n] = 10 log10(E{d^2[n]} / E{e^2[n]})",
      "SDR = 10 log10(||s||^2 / ||s_hat - s||^2)",
      "SI-SDR 先对估计信号做尺度投影再计算失真",
      "MOS 通常是 1-5 分主观质量分",
      "置信区间随样本数和评分方差变化"
    ],
    lab: {
      title: "指标与听感对齐",
      steps: [
        "准备 20 条样例：干净语音、平稳噪声、键盘声、混响、双讲、残余回声。",
        "对两个算法版本跑 ERLE、STOI、PESQ 或可用替代指标。",
        "人工听测标注：残留噪声、吞字、金属音、回声、响度突变。",
        "做一张指标和听感不一致的案例表。"
      ],
      output: "一份版本评测报告模板，包含指标表、听感标签和结论。"
    },
    pitfalls: [
      "只看平均分，不看分场景和最差样例。",
      "用不满足条件的客观指标评估强失真增强语音。",
      "听测时音量未归一，评分被响度偏差污染。"
    ],
    questions: [
      "为什么 ERLE 高但用户仍然听到回声？",
      "P.835 三个维度分别能帮你定位什么？",
      "怎么设计一次可信的 A/B 听测？"
    ],
    resources: [
      { label: "ITU-T P.835", url: "https://www.itu.int/rec/T-REC-P.835", note: "语音增强主观评测。" },
      { label: "ITU-T P.808", url: "https://www.itu.int/rec/T-REC-P.808", note: "众包主观语音质量评测。" }
    ]
  },
  8: {
    title: "个人音频实验台",
    subtitle: "把前 7 周能力沉淀成可复用工具，而不是散落的 notebook。",
    objective: "搭建一个能批处理、出图、出指标、留实验记录的 audio_lab 工具。",
    mentalModel: "音频算法工程师的效率差距，很大来自是否有自己的数据、指标、可视化和复现实验工具箱。",
    sections: [
      {
        title: "核心模块",
        items: [
          "io：WAV/PCM 读写、通道选择、归一化、重采样。",
          "dsp：分帧、窗函数、STFT/ISTFT、滤波器、增益和混音。",
          "metrics：RMS、SNR、ERLE、STOI/PESQ 接口、延迟估计。",
          "viz：波形、谱图、PSD、相关曲线、指标曲线。",
          "batch：批量处理目录，保存 config、版本、输入输出路径和报告。"
        ]
      },
      {
        title: "工程直觉",
        items: [
          "任何算法实验都要能回答：输入是什么、参数是什么、输出在哪里、指标如何复现。",
          "图比单个数值更能暴露问题；音频 A/B 比一堆形容词更能沟通。",
          "从第一天就用固定目录结构，会让后续工作轻很多。"
        ]
      }
    ],
    formulas: [
      "统一配置：sample_rate、frame_ms、hop_ms、channels、dtype",
      "统一报告：input -> process -> output -> metrics -> notes",
      "批处理最小单元：case_id + scene_tag + far/mic/near/clean/out"
    ],
    lab: {
      title: "audio_lab CLI",
      steps: [
        "实现 `inspect`：打印音频元信息和基础统计。",
        "实现 `plot`：输出 waveform、spectrogram、PSD。",
        "实现 `metric`：至少支持 RMS、SNR、delay、ERLE。",
        "实现 `report`：对一个目录批处理并生成 HTML 或 Markdown 报告。"
      ],
      output: "一个后续 16 周都能复用的音频实验工具。"
    },
    pitfalls: [
      "每次实验手动改脚本，没有 config 和版本记录。",
      "输出文件名不包含关键参数，几天后完全不知道哪个是哪个。",
      "只存处理后音频，不存原始输入和中间信号。"
    ],
    questions: [
      "一个可复现实验最少需要记录哪些信息？",
      "为什么音频算法调试必须保存中间信号？",
      "如何让你的实验报告能被同事快速复查？"
    ],
    resources: [
      { label: "librosa", url: "https://librosa.org/doc/latest/index.html", note: "快速做音频特征和可视化。" },
      { label: "soundfile", url: "https://python-soundfile.readthedocs.io/", note: "可靠 WAV/FLAC 读写。" }
    ]
  },
  9: {
    title: "传统单通道降噪",
    subtitle: "理解深度降噪之前，先掌握经典谱域增强的逻辑。",
    objective: "能实现谱减、Wiener、MMSE 思路的 baseline，并解释 musical noise、吞字和残留噪声。",
    mentalModel: "传统降噪的核心是估计噪声谱，再为每个时频点设计一个不会太伤语音的增益。",
    sections: [
      {
        title: "核心概念",
        items: [
          "谱减法假设噪声谱可估计，用观测谱减去噪声谱，简单但容易产生 musical noise。",
          "Wiener filter 根据语音和噪声功率比设计最小均方误差意义下的增益。",
          "MMSE-STSA 直接估计短时谱幅度，通常比简单谱减更平滑。",
          "噪声估计可用 VAD、最小统计、分位数跟踪、递归平滑等方法。",
          "增益下限、频域平滑、时间平滑和语音存在概率是传统降噪调参核心。"
        ]
      },
      {
        title: "工程直觉",
        items: [
          "降噪不是把噪声降到零，而是在残留噪声和语音失真之间找产品可接受点。",
          "非平稳噪声和瞬态噪声最容易暴露传统算法的局限。",
          "传统降噪仍然适合作为轻量后处理、baseline 和深度模型失败时的兜底。"
        ]
      }
    ],
    formulas: [
      "观测模型：Y(k,l)=S(k,l)+N(k,l)",
      "谱减：|S_hat|^2 = max(|Y|^2 - alpha |N_hat|^2, beta |Y|^2)",
      "Wiener 增益：G = SNR / (SNR + 1)",
      "后验 SNR：gamma = |Y|^2 / lambda_N",
      "先验 SNR 可用 decision-directed 平滑估计"
    ],
    lab: {
      title: "传统降噪 baseline",
      steps: [
        "实现噪声估计：前 0.5s 静音估计和递归最小统计各一版。",
        "实现谱减和 Wiener 两个算法，保留原相位重构。",
        "对平稳风扇声、键盘声、音乐干扰分别处理。",
        "调节 alpha、gain floor、时间平滑，听 musical noise 和吞字变化。"
      ],
      output: "传统降噪对比报告：参数、指标、听感标签、失败样例。"
    },
    pitfalls: [
      "噪声估计过快，把弱语音当噪声学进去。",
      "增益变化太剧烈，产生音乐噪声和颤音。",
      "只在白噪声上测试，实际办公室噪声完全不同。"
    ],
    questions: [
      "Wiener 增益为什么在低 SNR 时趋近 0？",
      "decision-directed 方法为什么能减小 musical noise？",
      "什么时候宁愿保留一点噪声也不要继续压？"
    ],
    resources: [
      { label: "Speech Enhancement 经典入口", url: "https://www.ee.columbia.edu/~dpwe/e6820/", note: "可作为传统语音增强补充材料。" },
      { label: "Spectral Audio Signal Processing", url: "https://ccrma.stanford.edu/~jos/sasp/", note: "谱域处理基础。" }
    ]
  },
  10: {
    title: "自适应滤波器",
    subtitle: "AEC 的数学发动机：让滤波器自动追踪未知系统。",
    objective: "能推导并实现 LMS/NLMS/RLS 的基本形式，知道步长、收敛和发散如何权衡。",
    mentalModel: "自适应滤波是在边听输入边修正一个未知系统模型，修得太慢跟不上，修得太快会发散或伤语音。",
    sections: [
      {
        title: "核心概念",
        items: [
          "LMS 用误差的负梯度方向更新滤波器，简单稳定但收敛速度依赖输入功率。",
          "NLMS 用输入能量归一化步长，比 LMS 更适合语音这类功率变化大的信号。",
          "RLS 收敛快但计算量和数值稳定性压力大。",
          "leakage 可以避免滤波器系数无限漂移，尤其在低激励或噪声场景。",
          "misalignment 衡量估计滤波器和真实系统之间的偏差。"
        ]
      },
      {
        title: "工程直觉",
        items: [
          "far-end 信号如果缺乏频谱激励，某些频段的回声路径就学不准。",
          "双讲时误差信号包含 near-end，直接更新会把近端语音学进滤波器导致发散。",
          "实际 AEC 会有多级控制：步长、双讲、泄漏、重置、路径变化检测。"
        ]
      }
    ],
    formulas: [
      "误差：e[n] = d[n] - w^T[n]x[n]",
      "LMS：w[n+1] = w[n] + mu e[n]x[n]",
      "NLMS：w[n+1] = w[n] + mu e[n]x[n] / (||x[n]||^2 + delta)",
      "稳定步长直觉：mu 过大易发散，过小收敛慢",
      "misalignment = 10 log10(||h-w||^2 / ||h||^2)"
    ],
    lab: {
      title: "未知 FIR 系统识别",
      steps: [
        "生成随机 FIR h，输入白噪声或语音 x，得到 d=h*x。",
        "用 LMS/NLMS 估计 h，画 misalignment 和 error power。",
        "改变 step size、滤波器长度、输入信号类型，比较收敛速度。",
        "加入 near-end 语音模拟双讲，观察不加保护时的发散。"
      ],
      output: "自适应滤波实验报告：收敛曲线、步长表、双讲失败样例。"
    },
    pitfalls: [
      "滤波器长度短于真实回声路径，ERLE 上不去。",
      "步长固定不变，无法兼顾快速收敛和双讲稳定。",
      "没有输入能量保护，静音或低能量时更新爆炸。"
    ],
    questions: [
      "NLMS 为什么比 LMS 更适合语音输入？",
      "双讲检测本质上保护的是什么？",
      "回声路径突变时应该快速重学还是保守更新？"
    ],
    resources: [
      { label: "Adaptive Filter Theory 资料入口", url: "https://en.wikipedia.org/wiki/Least_mean_squares_filter", note: "先用作公式索引，再找教材深入。" },
      { label: "SpeexDSP AEC", url: "https://www.speex.org/docs/manual/speex-manual/node7.html", note: "工程实现中的自适应滤波参考。" }
    ]
  },
  11: {
    title: "声学回声消除核心链路",
    subtitle: "从 NLMS 走到可用 AEC：延迟、频域分块、双讲、残余回声。",
    objective: "能搭出一个 FDAF AEC 原型，并知道工业 AEC 为什么要这么复杂。",
    mentalModel: "AEC 是一个受延迟、双讲、非线性、混响和播放链路影响的闭环系统，不是单个滤波器。",
    sections: [
      {
        title: "核心概念",
        items: [
          "延迟估计先把 far-end reference 和 mic echo 对齐，否则自适应滤波器会浪费长度追延迟。",
          "频域分块自适应滤波用 FFT 加速长滤波器，适合几百毫秒回声尾长。",
          "DTD 检测双讲，避免 near-end 语音污染滤波器更新。",
          "NLP/RES 在线性 AEC 后处理残余回声，但过强会伤 near-end。",
          "CNG 在强抑制后补舒适噪声，避免背景噪声突兀消失。"
        ]
      },
      {
        title: "工程直觉",
        items: [
          "AEC 调试必须看 far、mic、linear out、final out，不然无法区分线性残余和后处理失真。",
          "用户抱怨回声，可能是延迟错、滤波器没收敛、双讲保护过强、NLP 不够、非线性太重。",
          "会议设备中播放音量、扬声器失真、麦克风位置都会直接改变 AEC 难度。"
        ]
      }
    ],
    formulas: [
      "mic：d[n] = h*x[n-delay] + s[n] + v[n]",
      "AEC error：e[n] = d[n] - y_hat[n]",
      "ERLE = 10 log10(E{d_echo^2}/E{e^2})",
      "频域卷积：Y[k] = H[k]X[k]",
      "双讲期间应降低或冻结自适应更新"
    ],
    lab: {
      title: "Block FDAF AEC",
      steps: [
        "先用已知 delay 和单通道 far/mic 合成数据跑 NLMS。",
        "实现频域分块滤波，比较和时域 NLMS 的 CPU。",
        "加入简单延迟搜索，在相关峰附近对齐 far。",
        "加入 near-end 双讲，测试冻结更新和降低步长两种策略。",
        "输出 ERLE、near-end distortion、残余回声听感标签。"
      ],
      output: "一个最小可运行 AEC 原型和 5 类压力测试样例。"
    },
    pitfalls: [
      "只在 single-talk far-end 场景看 ERLE，忽略双讲近端失真。",
      "NLP 太强造成近端语音被门控、断续。",
      "延迟变化或时钟漂移没处理，跑一段时间后突然变差。"
    ],
    questions: [
      "为什么 AEC 需要 delay estimator？",
      "双讲检测错误会分别造成什么后果？",
      "残余回声抑制和降噪有什么相似和不同？"
    ],
    resources: [
      { label: "Microsoft AEC Challenge", url: "https://github.com/microsoft/AEC-Challenge", note: "数据和评测场景参考。" },
      { label: "SpeexDSP Acoustic Echo Canceller", url: "https://www.speex.org/docs/manual/speex-manual/node7.html", note: "传统 AEC 工程接口参考。" }
    ]
  },
  12: {
    title: "阅读 WebRTC AEC3 与 SpeexDSP",
    subtitle: "通过工业代码理解一个可上线 AEC 的模块拆分。",
    objective: "能画出 WebRTC AEC3 的关键模块图，并把源码概念映射到自己的 AEC 原型。",
    mentalModel: "工业实现的复杂性来自大量场景保护、状态机、参数约束和可诊断性，而不只是核心公式。",
    sections: [
      {
        title: "阅读路线",
        items: [
          "先看 AudioProcessing 的输入输出节奏：10 ms frame、sample rate、channels。",
          "再看 AEC3 的 EchoCanceller3 作为顶层入口，理解 capture/render 两条链路。",
          "关注 delay controller：如何估计 render 与 capture 对齐关系。",
          "关注 subtractor：线性回声估计和误差输出。",
          "关注 echo remover/suppressor：残余回声建模和增益计算。"
        ]
      },
      {
        title: "对比 SpeexDSP",
        items: [
          "SpeexDSP MDF 更轻量，适合理解传统频域 AEC 的骨架。",
          "WebRTC AEC3 场景保护更多，适合学习工业鲁棒性。",
          "对比两者接口、状态、延迟处理、后处理和配置参数。"
        ]
      }
    ],
    formulas: [
      "源码阅读目标：入口 -> 状态 -> 数据流 -> 控制量 -> 输出",
      "AEC 模块图：render buffer -> delay -> linear echo estimate -> residual echo model -> suppression",
      "调试信号：far/render、capture、linear output、final output、delay、ERLE"
    ],
    lab: {
      title: "工业代码拆解报告",
      steps: [
        "画 WebRTC AEC3 顶层数据流图。",
        "列出 10 个关键类或文件，每个写一句职责。",
        "把自己的 FDAF 原型对应到 WebRTC/SpeexDSP 的模块。",
        "整理 10 个 AEC 线上问题，标出应看哪些中间信号和日志。"
      ],
      output: "一份 AEC3/SpeexDSP 阅读笔记和排障 checklist。"
    },
    pitfalls: [
      "一上来陷入每行代码，忘记先画数据流。",
      "只看核心滤波，不看 delay、buffer、config 和异常保护。",
      "把开源默认参数当成所有产品都适用的答案。"
    ],
    questions: [
      "WebRTC AEC3 为什么要维护 render 侧缓冲？",
      "传统 MDF AEC 和 AEC3 复杂性的主要差别在哪里？",
      "你会给 AEC 模块暴露哪些 debug dump？"
    ],
    resources: [
      { label: "WebRTC AEC3 Source", url: "https://webrtc.googlesource.com/src/+/refs/heads/main/modules/audio_processing/aec3/", note: "重点读顶层和关键模块。" },
      { label: "SpeexDSP Manual", url: "https://www.speex.org/docs/manual/speex-manual/", note: "轻量传统实现参考。" }
    ]
  },
  13: {
    title: "麦克风阵列与 TDOA",
    subtitle: "从两麦延迟估计走向多麦几何定位。",
    objective: "能模拟阵列接收信号，用 GCC-PHAT 估计 TDOA，并解释空间混叠。",
    mentalModel: "阵列处理靠不同麦克风之间的时间差和相位差吃饭，几何误差和混响会直接污染这些差异。",
    sections: [
      {
        title: "核心概念",
        items: [
          "远场声源到达阵列可近似为平面波，近场则需要考虑距离差和幅度差。",
          "TDOA 是声源到不同麦克风传播时间之差，是两麦定位基础。",
          "GCC-PHAT 对互功率谱做相位归一化，弱化幅度影响，突出时延峰。",
          "麦距越大，低频分辨率越好，但高频越容易空间混叠。",
          "阵列通道增益、相位、同步误差会让理论 TDOA 偏离实际。"
        ]
      },
      {
        title: "工程直觉",
        items: [
          "小型会议设备麦距有限，低频定位分辨率天然受限。",
          "混响会产生多个相关峰，最大峰未必是直达声。",
          "定位结果要给置信度，不要只给一个角度。"
        ]
      }
    ],
    formulas: [
      "传播延迟：tau_i = ||p_source - p_mic_i|| / c",
      "两麦 TDOA：Delta tau = (d cos(theta)) / c",
      "最大无混叠频率近似：f_alias = c / (2d)",
      "GCC-PHAT：R12(tau)=IFFT{X1(f)X2*(f)/|X1(f)X2*(f)|}",
      "角度估计：theta = arccos(c Delta tau / d)"
    ],
    lab: {
      title: "2/4/6 麦阵列仿真",
      steps: [
        "定义线阵和圆阵几何，生成不同角度的远场平面波。",
        "加入噪声和混响，计算两两 GCC-PHAT。",
        "用 TDOA 估计角度，画真实角度 vs 估计角度。",
        "改变麦距，计算空间混叠频率并听/看高频相位歧义。"
      ],
      output: "阵列仿真脚本、GCC-PHAT 峰图、角度误差曲线。"
    },
    pitfalls: [
      "角度单位和坐标系定义不清，导致结果左右反。",
      "忽略采样率限制，TDOA 只能落在离散 sample 或插值位置。",
      "用混响最强峰当直达声，定位跳变严重。"
    ],
    questions: [
      "为什么 PHAT 在混响环境中常比普通互相关好？",
      "麦距变大为什么既有好处也有坏处？",
      "如何给 DOA 输出置信度？"
    ],
    resources: [
      { label: "PySDR DOA", url: "https://pysdr.org/content/doa.html", note: "阵列和方向估计直觉很清晰。" },
      { label: "Pyroomacoustics DOA", url: "https://pyroomacoustics.readthedocs.io/en/pypi-release/pyroomacoustics.doa.html", note: "可直接做仿真实验。" }
    ]
  },
  14: {
    title: "声源定位：SRP-PHAT、MUSIC、ESPRIT",
    subtitle: "从时延峰走向空间谱搜索和子空间方法。",
    objective: "能实现或调用 SRP-PHAT/MUSIC，知道它们在混响、多源和低 SNR 下的表现差异。",
    mentalModel: "DOA 算法都在问同一件事：哪个方向的阵列响应最能解释当前多通道观测。",
    sections: [
      {
        title: "核心概念",
        items: [
          "SRP-PHAT 对候选方向累加多麦对的 PHAT 相关值，找能量最大的方向。",
          "MUSIC 用协方差矩阵特征分解，把信号子空间和噪声子空间分开。",
          "ESPRIT 利用阵列平移不变结构估计角度，要求阵列结构更严格。",
          "宽带语音需要跨频带聚合，不能直接套窄带单频公式。",
          "多源定位需要估计源数、处理相干源和混响导致的秩膨胀。"
        ]
      },
      {
        title: "工程直觉",
        items: [
          "SRP-PHAT 鲁棒但计算量随搜索网格上升。",
          "MUSIC 分辨率高，但对阵列标定、SNR 和源数估计更敏感。",
          "会议产品常用平滑、跟踪和置信度策略避免角度跳变。"
        ]
      }
    ],
    formulas: [
      "协方差：Rxx = E{x x^H}",
      "MUSIC 谱：P(theta)=1/(a^H(theta) En En^H a(theta))",
      "steering vector：a(theta,f)=exp(-j2*pi*f*tau_i(theta))",
      "SRP：P(theta)=sum_{i,j} R_ij(tau_ij(theta))",
      "角度误差：err = wrap(theta_hat - theta_true)"
    ],
    lab: {
      title: "SRP/MUSIC 对比",
      steps: [
        "用 pyroomacoustics 生成 4 麦圆阵和不同角度声源。",
        "跑 SRP-PHAT 和 MUSIC，输出空间谱曲线。",
        "改变 SNR、RT60、源数，统计角度误差 CDF。",
        "加入时间平滑和置信度门限，观察定位稳定性。"
      ],
      output: "DOA benchmark：空间谱图、误差 CDF、失败样例。"
    },
    pitfalls: [
      "MUSIC 的源数设错，空间谱出现假峰或漏峰。",
      "没有阵列标定，实际数据上理论 steering vector 不匹配。",
      "搜索角度分辨率过粗，误差被网格限制。"
    ],
    questions: [
      "SRP-PHAT 为什么适合宽带语音？",
      "MUSIC 的噪声子空间是什么意思？",
      "多源定位为什么比单源难很多？"
    ],
    resources: [
      { label: "Pyroomacoustics DOA docs", url: "https://pyroomacoustics.readthedocs.io/en/pypi-release/pyroomacoustics.doa.html", note: "SRP、MUSIC、CSSM 等入口。" },
      { label: "PySDR Direction Finding", url: "https://pysdr.org/content/doa.html", note: "MUSIC 直觉和可视化。" }
    ]
  },
  15: {
    title: "波束形成与多波束",
    subtitle: "从“知道声源在哪”到“增强目标方向、压制其他方向”。",
    objective: "能实现 DS 和 MVDR beamformer，画出 beam pattern，并理解多波束扫描。",
    mentalModel: "波束形成是在多麦信号上做空间滤波：目标方向相干叠加，非目标方向相互抵消。",
    sections: [
      {
        title: "核心概念",
        items: [
          "Delay-and-sum 先对齐目标方向的各麦信号再求和，简单稳定。",
          "MVDR 在保持目标方向无失真的约束下最小化输出功率。",
          "LCMV 可加入多个线性约束，例如保持目标、压制干扰方向。",
          "GEV 最大化输出 SNR，常结合后置归一化避免失真。",
          "mask-based beamforming 用语音/噪声 mask 估计协方差矩阵。"
        ]
      },
      {
        title: "工程直觉",
        items: [
          "DS 更稳但抑制能力有限；MVDR 抑制强但怕协方差估计和标定误差。",
          "null 很深不一定好，阵列误差会让 null 偏移，造成目标语音受损。",
          "多波束可用于声源搜索、跟踪和会议拾音区域覆盖。"
        ]
      }
    ],
    formulas: [
      "DS：y = (1/M) sum_i x_i delayed",
      "MVDR：min_w w^H Rnn w, s.t. w^H d = 1",
      "MVDR 解：w = Rnn^-1 d / (d^H Rnn^-1 d)",
      "Beam pattern：B(theta)=w^H a(theta)",
      "对角加载：R_loaded = R + epsilon I"
    ],
    lab: {
      title: "DS/MVDR 与多波束图",
      steps: [
        "在仿真阵列上实现 DS beamformer，画不同频率的 beam pattern。",
        "估计噪声协方差，实现 MVDR，并加入 diagonal loading。",
        "做 0-360 度多波束扫描，输出方向-时间能量图。",
        "加入阵列位置误差，观察主瓣、旁瓣、null depth 变化。"
      ],
      output: "波束图、多波束扫描图、MVDR 稳定性报告。"
    },
    pitfalls: [
      "协方差估计包含目标语音，MVDR 把目标也压掉。",
      "steering vector 坐标系和 DOA 坐标系不一致。",
      "只看单频 beam pattern，不看宽带语音整体效果。"
    ],
    questions: [
      "MVDR 的无失真约束是什么意思？",
      "为什么 diagonal loading 能提高稳定性？",
      "先做 AEC 还是先做 BF 会改变什么？"
    ],
    resources: [
      { label: "Pyroomacoustics Beamforming", url: "https://pyroomacoustics.readthedocs.io/", note: "波束形成仿真可用。" },
      { label: "PySDR Beamforming", url: "https://pysdr.org/content/doa.html", note: "空间滤波直觉。" }
    ]
  },
  16: {
    title: "AEC、波束与产品链路耦合",
    subtitle: "学习会议终端里模块顺序为什么不是随便串。",
    objective: "能比较先 AEC 后 BF、先 BF 后 AEC、多通道 AEC 的优劣。",
    mentalModel: "单个模块最优不等于链路最优；模块之间会通过相位、延迟、增益、非线性和状态相互影响。",
    sections: [
      {
        title: "关键耦合",
        items: [
          "AEC 需要 far reference 和 mic echo 对齐；BF 会改变 mic 通道组合和回声路径。",
          "先 BF 后 AEC 可减少通道数，但 beamformer 输出的回声路径随波束变化。",
          "先 AEC 后 BF 保留多通道信息，但需要多通道 AEC，算力和状态复杂。",
          "NS 在 AEC 前可能破坏回声相关性，在 AEC 后又可能掩盖残余回声判断。",
          "AGC 放在不同位置会改变 VAD、NS、AEC 后处理的工作点。"
        ]
      },
      {
        title: "工程取舍",
        items: [
          "端侧算力紧张时，可能牺牲部分空间处理能力换实时稳定。",
          "固定波束、动态波束、多波束输出，对 AEC 状态管理要求不同。",
          "产品方案需要明确：目标场景、麦数、扬声器位置、CPU、延迟、指标和可维护性。"
        ]
      }
    ],
    formulas: [
      "链路延迟 = 采集缓冲 + 算法帧长 + lookahead + 播放/网络缓冲",
      "AEC before BF：M 路 AEC -> BF -> NS/AGC",
      "BF before AEC：BF -> 单路 AEC -> NS/AGC",
      "多目标权衡：quality, latency, CPU, memory, robustness"
    ],
    lab: {
      title: "两种链路顺序对比",
      steps: [
        "用 4 麦仿真数据构造 far echo、near speech、noise。",
        "实现链路 A：每路 AEC 后做 BF。",
        "实现链路 B：先 BF 再单路 AEC。",
        "比较 ERLE、语音失真、DOA 稳定、CPU 和延迟。",
        "写一页会议终端链路方案。"
      ],
      output: "AEC/BF 链路对比表和方案文档。"
    },
    pitfalls: [
      "只在单模块数据集上评估，集成后指标退化。",
      "模块采样率、帧长、通道顺序不一致。",
      "没有中间 dump，链路问题只能靠猜。"
    ],
    questions: [
      "为什么 NS 放在 AEC 前通常有风险？",
      "动态波束会给 AEC 带来什么额外问题？",
      "如何定义一个会议音频链路的模块接口？"
    ],
    resources: [
      { label: "WebRTC Audio Processing Module", url: "https://webrtc.googlesource.com/src/+/refs/heads/main/modules/audio_processing/", note: "观察真实 RTC 音频链路组织。" },
      { label: "Microsoft AEC Challenge", url: "https://github.com/microsoft/AEC-Challenge", note: "深度/混合 AEC 场景参考。" }
    ]
  },
  17: {
    title: "深度学习语音增强基础",
    subtitle: "从传统谱域增强过渡到可训练模型。",
    objective: "能搭建 PyTorch 数据管线，训练一个因果 CRN/RNN mask 模型。",
    mentalModel: "深度语音增强仍然在估计时频增益或谱映射，只是把规则和参数交给数据学习。",
    sections: [
      {
        title: "核心概念",
        items: [
          "常见目标包括 magnitude mask、complex mask、直接估计 clean spectrum 或 waveform。",
          "因果模型只能使用当前和过去帧，非因果模型可看未来但会增加延迟。",
          "损失函数可在时域、频域或感知域定义，不同损失优化的听感不同。",
          "数据混合要覆盖 SNR、噪声类型、房间混响、设备频响和响度。",
          "训练和推理的 STFT 参数必须一致，流式模型还要管理隐藏状态。"
        ]
      },
      {
        title: "工程直觉",
        items: [
          "模型泛化很大程度由数据决定，不是换网络结构就能解决一切。",
          "低延迟会议增强通常偏向小模型、因果、频域或子带结构。",
          "听感失败样例要回流到数据集，而不是只调一个阈值。"
        ]
      }
    ],
    formulas: [
      "混合：y = s + alpha n",
      "IRM：M = |S|^2 / (|S|^2 + |N|^2)",
      "增强：S_hat = M_hat * Y",
      "SI-SDR loss = - SI-SDR(s_hat, s)",
      "Multi-resolution STFT loss = sum_i L_stft_i"
    ],
    lab: {
      title: "小型 CRN/RNN DNS",
      steps: [
        "构造 clean/noise 数据混合脚本，随机 SNR、随机 RIR、随机增益。",
        "实现 STFT 特征和 mask label，训练一个小型 CRN 或 GRU 模型。",
        "实现因果流式推理，每次处理一个 chunk。",
        "比较 L1 magnitude、SI-SDR、multi-resolution STFT loss。",
        "导出 10 条成功和 10 条失败样例。"
      ],
      output: "一个可训练、可推理、可听测的小型深度降噪 baseline。"
    },
    pitfalls: [
      "训练集太干净，真实混响和设备噪声下泛化差。",
      "用未来帧训练，部署时又要求低延迟。",
      "只看 loss 下降，不听失败样例。"
    ],
    questions: [
      "mask 估计和 clean spectrum 映射各有什么优缺点？",
      "因果模型延迟怎么计算？",
      "为什么数据增强比盲目加大模型更重要？"
    ],
    resources: [
      { label: "Microsoft DNS Challenge", url: "https://github.com/microsoft/DNS-Challenge", note: "数据、baseline、评测入口。" },
      { label: "torchaudio", url: "https://pytorch.org/audio/stable/index.html", note: "音频深度学习数据管线。" }
    ]
  },
  18: {
    title: "RNNoise、DCCRN、DPCRN、FullSubNet",
    subtitle: "学习低延迟语音增强模型的常见结构谱系。",
    objective: "理解轻量 RNN、复数网络、双路径和全带/子带融合的设计动机。",
    mentalModel: "模型结构是在音质、延迟、算力、泛化和实现复杂度之间做工程选择。",
    sections: [
      {
        title: "模型谱系",
        items: [
          "RNNoise 用轻量 RNN 和传统特征实现低算力实时降噪，适合理解产品化思路。",
          "DCCRN 在复数 STFT 域建模，显式处理实部、虚部和相位相关信息。",
          "DPCRN 用双路径结构同时建模时间和频率依赖，常见于低延迟增强。",
          "FullSubNet 结合全带上下文和子带细节，对窄带频点噪声有优势。",
          "Transformer/Conformer 类模型能力强，但流式部署和算力需要谨慎。"
        ]
      },
      {
        title: "工程直觉",
        items: [
          "会议设备上模型大小、MACs、状态缓存和内存访问都要算。",
          "模型输出越自由，越可能产生伪影；约束型 mask 往往更稳。",
          "轻量模型的上限取决于数据和特征工程，不只是层数。"
        ]
      }
    ],
    formulas: [
      "Complex mask：S_hat = (M_r + j M_i) * (Y_r + j Y_i)",
      "RTF = processing_time / audio_duration",
      "因果卷积 lookahead = 0，非因果卷积会引入未来帧",
      "模型预算：参数量、MACs/s、峰值内存、状态大小"
    ],
    lab: {
      title: "复现轻量 DNS baseline",
      steps: [
        "选择 RNNoise 或一个小型 DPCRN baseline 作为阅读对象。",
        "整理输入特征、网络结构、输出目标和损失函数。",
        "用自己的数据跑训练或推理，测 RTF 和内存。",
        "按噪声类型分桶听测：风扇、键盘、音乐、人群、混响。",
        "记录模型失败样例和可能的数据补强方向。"
      ],
      output: "模型卡片：结构、延迟、算力、指标、失败场景。"
    },
    pitfalls: [
      "看到论文分数高就直接用，忽略模型延迟和部署限制。",
      "只测 GPU 推理，不测目标 CPU 或嵌入式平台。",
      "没做响度归一，误以为更响的版本更清晰。"
    ],
    questions: [
      "RNNoise 为什么没有直接用巨大网络？",
      "复数谱模型相比幅度 mask 解决了什么问题？",
      "FullSubNet 的全带和子带分别提供什么信息？"
    ],
    resources: [
      { label: "RNNoise", url: "https://github.com/xiph/rnnoise", note: "轻量实时降噪经典代码。" },
      { label: "Microsoft DNS Challenge", url: "https://github.com/microsoft/DNS-Challenge", note: "对比现代 DNS baseline。" }
    ]
  },
  19: {
    title: "深度 AEC 与残余回声抑制",
    subtitle: "把传统 AEC 和神经网络后处理结合起来。",
    objective: "能构造 far/mic/clean 数据，训练一个残余回声抑制模型，并比较混合方案。",
    mentalModel: "深度 AEC 不只是降噪多一个输入；它必须理解 far-end 与 mic 中回声成分的关系，同时保护 near-end。",
    sections: [
      {
        title: "核心概念",
        items: [
          "深度 AEC 输入常包括 far-end reference、mic signal、linear AEC output、estimated echo。",
          "残余回声抑制 RES 通常接在传统 AEC 后，重点处理非线性和未建模残余。",
          "双讲保护仍然关键：不能为了压回声把近端说话人也压掉。",
          "训练目标可分为 clean near-end、echo mask、residual echo mask 或多任务。",
          "AECMOS 等指标可辅助评估，但关键样例必须人工听。"
        ]
      },
      {
        title: "工程直觉",
        items: [
          "纯神经 AEC 对数据覆盖要求很高，混合方案更容易工程落地。",
          "far-end 和 mic 的延迟对齐仍然重要，神经网络不是万能对齐器。",
          "非线性扬声器、音乐 far-end、双讲弱 near-end 是重点压力场景。"
        ]
      }
    ],
    formulas: [
      "mic = near + echo + noise",
      "linear_out = mic - echo_hat_linear",
      "RES 输入可为 [far_mag, mic_mag, linear_out_mag, echo_hat_mag]",
      "目标：near_hat = model(inputs)",
      "双讲损失要同时关注 echo suppression 和 near-end preservation"
    ],
    lab: {
      title: "传统 AEC + 神经 RES",
      steps: [
        "生成 far、echo、near、noise、mic、clean near-end 多路数据。",
        "先跑传统 AEC 得到 linear_out 和 estimated_echo。",
        "训练一个小模型估计 residual echo suppression mask。",
        "比较 mic、传统 AEC、传统 AEC+RES、纯神经模型。",
        "重点听双讲、音乐 far-end、非线性 echo。"
      ],
      output: "深度 RES demo、AECMOS/ERLE/听感对比报告。"
    },
    pitfalls: [
      "训练数据 far/mic 延迟太理想，真实设备对齐误差下失效。",
      "loss 只奖励回声压制，导致近端语音被严重伤害。",
      "没覆盖音乐和非语音 far-end，会议共享视频时回声残留。"
    ],
    questions: [
      "为什么传统 AEC 后接神经 RES 更容易落地？",
      "深度 AEC 训练样本需要哪些同步信号？",
      "如何评价双讲时 near-end preservation？"
    ],
    resources: [
      { label: "Microsoft AEC Challenge", url: "https://github.com/microsoft/AEC-Challenge", note: "深度 AEC 数据和 baseline。" },
      { label: "WebRTC AEC3", url: "https://webrtc.googlesource.com/src/+/refs/heads/main/modules/audio_processing/aec3/", note: "传统 AEC 前端参考。" }
    ]
  },
  20: {
    title: "模型压缩、量化与端侧部署",
    subtitle: "把实验室模型变成实时可跑的产品模块。",
    objective: "能导出 ONNX，测 RTF、内存和延迟，并理解量化和状态缓存。",
    mentalModel: "部署不是训练结束后的保存文件，而是重新定义模型在目标硬件上的时间、内存和数值行为。",
    sections: [
      {
        title: "核心概念",
        items: [
          "RTF 小于 1 只是基本条件，实时音频还需要稳定低抖动。",
          "ONNX 导出要处理动态维度、状态输入输出和算子兼容。",
          "INT8 量化可降算力和内存，但可能损失低能量语音和细节。",
          "流式模型要缓存 RNN hidden state、卷积历史帧和 STFT overlap。",
          "SIMD 优化关注内存布局、对齐、批量向量化和 cache。"
        ]
      },
      {
        title: "工程直觉",
        items: [
          "一个模型上线要测平均耗时、P95/P99 耗时、峰值内存和长时间稳定性。",
          "量化前后必须听弱语音、低 SNR、双讲和静音段。",
          "如果模型需要未来帧，必须把 lookahead 算进端到端延迟。"
        ]
      }
    ],
    formulas: [
      "RTF = processing_time / audio_duration",
      "总延迟 = frame_len + lookahead + buffering + scheduling",
      "INT8 量化：x_int = round(x_float / scale) + zero_point",
      "状态缓存大小 = hidden + conv_context + stft_overlap",
      "CPU budget per 10 ms frame < 10 ms * target_utilization"
    ],
    lab: {
      title: "ONNX 流式部署压测",
      steps: [
        "把第 17/18 周模型导出 ONNX，并写等价性测试。",
        "实现 chunk-by-chunk 推理，显式传入传出状态。",
        "测 1 分钟、10 分钟、1 小时音频的平均和 P99 推理耗时。",
        "尝试 FP16 或 INT8，比较指标和听感。",
        "写模型上线风险清单。"
      ],
      output: "部署报告：ONNX、RTF、内存、延迟、量化前后听感。"
    },
    pitfalls: [
      "只测单帧耗时，不测长时间状态和内存泄漏。",
      "导出 ONNX 后没有和 PyTorch 输出逐帧对齐。",
      "量化校准数据太少，真实场景下低能量语音失真。"
    ],
    questions: [
      "RTF 和端到端延迟有什么区别？",
      "为什么流式模型导出比离线模型麻烦？",
      "INT8 量化最容易伤害哪些语音细节？"
    ],
    resources: [
      { label: "ONNX Runtime", url: "https://onnxruntime.ai/docs/", note: "端侧推理和量化文档。" },
      { label: "PyTorch Export ONNX", url: "https://pytorch.org/docs/stable/onnx.html", note: "导出流程参考。" }
    ]
  },
  21: {
    title: "会议音频全链路",
    subtitle: "把 AEC、BF、NS、AGC、编码和网络放到同一张图里。",
    objective: "能画出会议上行/下行完整信号链，并解释每个模块的输入、输出、状态和风险。",
    mentalModel: "用户听到的是整条链路的结果；任何单点算法都要在链路中承担清晰边界。",
    sections: [
      {
        title: "上行链路",
        items: [
          "Mic capture -> HPF/DC removal -> AEC -> BF/DOA -> NS/RES -> AGC/DRC -> limiter -> encoder。",
          "VAD 可服务于 NS、AGC、编码、唤醒和省电，但不同目标需要不同策略。",
          "AGC 调整响度，DRC 控制动态范围，limiter 防止削波。",
          "Opus 编码对语音/音乐/带宽有不同模式，前处理会影响编码效率。",
          "弱网下 jitter buffer、PLC 和 packet loss 会改变最终听感。"
        ]
      },
      {
        title: "下行链路",
        items: [
          "Network jitter buffer -> decoder -> PLC -> gain/render processing -> speaker playback。",
          "播放链路的延迟和非线性会反过来影响 AEC。",
          "上下行同步、设备时钟漂移和系统音量都要纳入排障。"
        ]
      }
    ],
    formulas: [
      "端到端延迟 = capture + processing + encode + network + jitter + decode + render",
      "Limiter 阈值要低于数字满幅留 headroom",
      "AGC 目标电平通常以 dBFS 表示",
      "Packet loss 会触发 PLC，连续丢包听感急剧下降"
    ],
    lab: {
      title: "全链路接口文档",
      steps: [
        "画上行和下行链路图，标注每个模块帧长、采样率和通道数。",
        "定义每个模块输入输出：音频、状态、控制量、debug dump。",
        "设计 15 个端到端回归场景：双讲、弱网、静音、音乐、混响、键盘、远讲。",
        "写一份用户反馈到模块定位的排查流程。"
      ],
      output: "会议音频链路图、模块接口表、端到端测试集。"
    },
    pitfalls: [
      "只优化上行，不听远端用户实际收到的编码后声音。",
      "模块各自归一化/增益处理，导致整体响度不可控。",
      "缺少链路级测试，单模块升级引发全局退化。"
    ],
    questions: [
      "AGC、NS、AEC 的顺序为什么重要？",
      "弱网音频问题和算法失真怎么区分？",
      "你会为每个模块保存哪些 debug 信息？"
    ],
    resources: [
      { label: "WebRTC Audio Processing", url: "https://webrtc.googlesource.com/src/+/refs/heads/main/modules/audio_processing/", note: "实时通信音频前处理参考。" },
      { label: "Opus Codec", url: "https://opus-codec.org/", note: "会议音频编码理解入口。" }
    ]
  },
  22: {
    title: "C/C++ 实时实现与性能优化",
    subtitle: "从 Python 原型走向稳定低延迟的工程实现。",
    objective: "能把一个 DSP 模块移植到 C/C++，写单测和 benchmark，并定位热点。",
    mentalModel: "实时音频代码要可预测：可预测耗时、内存、状态、错误边界和输出。",
    sections: [
      {
        title: "核心概念",
        items: [
          "音频回调里避免锁、阻塞 IO、大内存分配和不可控系统调用。",
          "C++ 模块要明确 init、process、reset、config、dump 接口。",
          "SIMD 优化要关注数据对齐、连续内存、循环展开和平台指令集。",
          "定点实现要设计 Q 格式、headroom、饱和和缩放策略。",
          "benchmark 要测平均、最大值、P95/P99，而不是只测一次。"
        ]
      },
      {
        title: "工程直觉",
        items: [
          "看起来快的算法，如果内存访问差，也可能在目标芯片上慢。",
          "实时系统最怕偶发超时，平均耗时漂亮没有用。",
          "可维护的 C++ 模块比一坨极限优化代码更适合团队长期迭代。"
        ]
      }
    ],
    formulas: [
      "每帧预算：budget_ms = frame_ms * CPU_target",
      "Q15 乘法：int32 product = int16 * int16, output = product >> 15",
      "峰值保护：saturate instead of wrap-around",
      "Cache 友好：线性访问优于随机访问"
    ],
    lab: {
      title: "STFT 或滤波器 C++ 移植",
      steps: [
        "选择 Python 中的 FIR/STFT 模块，定义 C++ 类接口。",
        "用同一输入比较 Python 和 C++ 输出误差。",
        "写单元测试：空输入、脉冲、正弦、随机噪声、分块一致性。",
        "写 benchmark，统计 10 ms 帧处理耗时分布。",
        "用 profiler 找 3 个热点并优化。"
      ],
      output: "C++ 模块、测试、benchmark 报告和优化记录。"
    },
    pitfalls: [
      "没有 reset 状态，切换设备或采样率后残留旧状态。",
      "浮点和定点版本没有对齐测试。",
      "优化前没有基准，改完不知道收益和风险。"
    ],
    questions: [
      "实时音频回调里为什么不能随便加日志？",
      "如何设计一个可测试的 DSP 模块接口？",
      "定点实现最容易出什么数值问题？"
    ],
    resources: [
      { label: "Google Benchmark", url: "https://github.com/google/benchmark", note: "C++ benchmark 常用工具。" },
      { label: "WebRTC common_audio", url: "https://webrtc.googlesource.com/src/+/refs/heads/main/common_audio/", note: "可参考实时 DSP 工程代码风格。" }
    ]
  },
  23: {
    title: "数据集、回归测试与听测平台",
    subtitle: "让算法迭代不靠感觉，而靠可复现测试闭环。",
    objective: "能构建场景覆盖的数据集，做版本 A/B 指标和人工听测。",
    mentalModel: "音频算法产品化的护城河之一，是数据和回归体系，而不是单次调参结果。",
    sections: [
      {
        title: "数据集设计",
        items: [
          "按场景分桶：近讲/远讲、单讲/双讲、混响、噪声类型、设备、音量、语言、性别。",
          "保存 dry clean、noise、RIR、far、mic、near、processed 等可复现中间信号。",
          "合成数据覆盖可控变量，真实数据覆盖不可控复杂性。",
          "每条样例要有 metadata：SNR、RT60、设备、场景、标签、问题类型。",
          "回归集要包含历史失败样例，防止修 A 坏 B。"
        ]
      },
      {
        title: "评测闭环",
        items: [
          "自动指标用于快速筛选，人工听测用于关键决策。",
          "版本报告要展示总体、分桶、最差样例、显著退化样例。",
          "失败样例要回流成新测试或新训练数据。"
        ]
      }
    ],
    formulas: [
      "case_id = scene + device + speaker + noise + snr + rir + seed",
      "版本对比：delta_metric = metric_new - metric_old",
      "分桶统计比总体均值更重要",
      "听测随机化和音量归一化是基础要求"
    ],
    lab: {
      title: "1000 条回归样例生成器",
      steps: [
        "整理 clean speech、noise、RIR 三类原始素材。",
        "随机混合生成 1000 条带 metadata 的样例。",
        "对两个算法版本批处理，生成指标 dashboard。",
        "挑选退化最大的 30 条做人工听测。",
        "给每条失败样例标注根因：噪声残留、吞字、回声、响度、伪影。"
      ],
      output: "回归数据集、版本 dashboard、失败样例库。"
    },
    pitfalls: [
      "数据集没有版本管理，结果无法复现。",
      "只保留平均指标，不保留具体音频样例。",
      "听测样例顺序固定，评分受顺序和响度影响。"
    ],
    questions: [
      "为什么历史失败样例应该进入回归集？",
      "如何设计一个覆盖会议产品的场景标签体系？",
      "指标提升但听感退化时如何决策？"
    ],
    resources: [
      { label: "Microsoft DNS Challenge", url: "https://github.com/microsoft/DNS-Challenge", note: "数据生成和评测组织参考。" },
      { label: "ITU-T P.808", url: "https://www.itu.int/rec/T-REC-P.808", note: "众包听测方法。" }
    ]
  },
  24: {
    title: "4 麦会议音频 Capstone",
    subtitle: "把 23 周的知识变成一个能演示、能评测、能讲清楚的作品。",
    objective: "完成一条 4 麦会议上行链路 demo：AEC、DOA、BF、NS、AGC、报告和排障手册。",
    mentalModel: "最后目标不是证明你看过多少材料，而是证明你能把复杂系统拆开、做出来、测清楚、讲明白。",
    sections: [
      {
        title: "系统目标",
        items: [
          "输入：4 麦 mic、多通道 far reference、可选 clean near-end label。",
          "处理：延迟估计、AEC、DOA、多波束或目标波束、降噪、AGC/limiter。",
          "输出：增强语音、DOA 曲线、关键中间信号、指标报告。",
          "场景：单讲、双讲、远端播放、混响、键盘噪声、多人干扰。",
          "约束：实时帧处理、固定采样率、明确 CPU/延迟预算。"
        ]
      },
      {
        title: "交付结构",
        items: [
          "README：系统框图、运行方式、数据格式、模块说明。",
          "demo：至少 10 条 A/B 音频对比，包含成功和失败样例。",
          "report：ERLE、DOA error、SNR/STOI 或可用指标、RTF、CPU。",
          "debug：far/mic/aec_out/bf_out/ns_out/agc_out 中间文件。",
          "troubleshooting：用户反馈到模块定位的排查手册。"
        ]
      }
    ],
    formulas: [
      "总链路：mic/far -> delay -> AEC -> DOA/BF -> NS/RES -> AGC -> out",
      "核心指标：ERLE, near-end distortion, DOA error, SNR/STOI, RTF, latency",
      "报告必须包含：平均值、分桶结果、最差样例和主观听感"
    ],
    lab: {
      title: "端到端会议音频 demo",
      steps: [
        "整理 10-30 条代表性样例，包含真实或仿真 4 麦数据。",
        "串起 AEC、DOA、BF、NS、AGC 的最小可运行链路。",
        "为每个模块保存中间输出和关键控制量。",
        "生成 A/B 音频、谱图、指标表、CPU/延迟表。",
        "写 15 分钟讲解稿：问题、方案、权衡、结果、失败样例、下一步。"
      ],
      output: "一个能给 leader 或导师演示的会议音频算法作品集。"
    },
    pitfalls: [
      "只展示最好样例，不展示失败样例，可信度不足。",
      "链路能跑但没有指标和中间 dump，无法定位问题。",
      "模块边界不清，后续维护困难。"
    ],
    questions: [
      "你的链路最大风险是什么？",
      "如果用户反馈“对方听到回声”，你的排查顺序是什么？",
      "如果 CPU 超限，你会先降级哪个模块，为什么？"
    ],
    resources: [
      { label: "WebRTC Audio Processing", url: "https://webrtc.googlesource.com/src/+/refs/heads/main/modules/audio_processing/", note: "工业链路参考。" },
      { label: "Pyroomacoustics", url: "https://pyroomacoustics.readthedocs.io/", note: "阵列和房间仿真。" },
      { label: "Microsoft DNS/AEC Challenges", url: "https://github.com/microsoft/DNS-Challenge", note: "数据、baseline 和评测思路。" }
    ]
  }
};
