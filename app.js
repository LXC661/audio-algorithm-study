const plan = [
  {
    week: 1,
    phase: "基础",
    filter: "foundation",
    title: "信号、采样与音频 I/O",
    summary: "掌握连续/离散信号、采样定理、量化、dBFS/dB SPL、声卡链路、帧长 hop、端到端延迟预算。",
    tags: ["sampling", "PCM", "latency", "dB"],
    tasks: ["写 WAV 读写与波形/RMS/峰值统计工具", "用 16 kHz/48 kHz 音频验证混叠与抗混叠滤波", "画出会议链路 10 ms 帧处理时序"]
  },
  {
    week: 2,
    phase: "基础",
    filter: "foundation",
    title: "卷积、相关、FFT 与 STFT",
    summary: "把卷积、互相关、能量谱、窗函数、overlap-add/overlap-save 练到能手写和调试。",
    tags: ["convolution", "FFT", "STFT", "OLA"],
    tasks: ["手写短时傅里叶变换与逆变换", "比较 Hann/Hamming/Rectangular 的泄漏", "用互相关估计两路信号延迟"]
  },
  {
    week: 3,
    phase: "基础",
    filter: "foundation",
    title: "滤波器、z 变换与多速率",
    summary: "学习 FIR/IIR、零极点、线性相位、双线性变换、重采样、polyphase 与实时滤波状态维护。",
    tags: ["FIR", "IIR", "resample", "z-transform"],
    tasks: ["设计 80 Hz 高通与语音带通滤波器", "实现 decimate/interpolate/resample_poly 对比", "解释滤波器群延迟对回声路径的影响"]
  },
  {
    week: 4,
    phase: "基础",
    filter: "foundation",
    title: "随机信号、噪声与实时工程",
    summary: "建立噪声功率谱、互谱、相干函数、平稳性、定点量化、环形缓冲区和线程安全意识。",
    tags: ["PSD", "coherence", "fixed-point", "ring buffer"],
    tasks: ["估计噪声 PSD 并画谱图", "写一个 lock-free 风格 ring buffer 原型", "用 Q15/Q31 模拟乘加溢出和饱和"]
  },
  {
    week: 5,
    phase: "语音声学",
    filter: "foundation",
    title: "语音产生、听感与基础特征",
    summary: "补齐基频、共振峰、梅尔尺度、响度、掩蔽效应、VAD 特征和语音可懂度的直觉。",
    tags: ["speech", "MFCC", "mel", "VAD"],
    tasks: ["做一个语音特征可视化面板", "比较语音/音乐/键盘声的谱结构", "写能量+过零率+谱熵 VAD baseline"]
  },
  {
    week: 6,
    phase: "语音声学",
    filter: "foundation",
    title: "房间声学与回声路径",
    summary: "学习 RIR、RT60、DRR、早期反射/晚期混响、扬声器非线性、麦克风安装和阵列几何误差。",
    tags: ["RIR", "RT60", "DRR", "calibration"],
    tasks: ["用 RIR 卷积生成 far-end echo 数据", "估计 RT60 并观察混响尾部", "列出会议设备常见声学失效模式"]
  },
  {
    week: 7,
    phase: "评测",
    filter: "product",
    title: "音质指标、主观测试与实验设计",
    summary: "掌握 ERLE、SDR/SI-SDR、STOI、PESQ/POLQA、DNSMOS、AECMOS、P.835/P.808 与 AB 测试设计。",
    tags: ["ERLE", "STOI", "PESQ", "MOS"],
    tasks: ["给同一组样例跑 5 种指标并解释矛盾", "设计一套 20 条样例的人工听测表", "建立指标、场景、失败原因三列表"]
  },
  {
    week: 8,
    phase: "工具",
    filter: "product",
    title: "个人音频实验台",
    summary: "把读写、重采样、滤波、STFT、指标、可视化、批处理串成可复用工具，后续所有项目都复用它。",
    tags: ["tooling", "batch", "visualization", "metrics"],
    tasks: ["搭建 audio_lab 命令行工具", "输出 waveform/spectrogram/metric report", "固定数据目录、配置和实验日志格式"]
  },
  {
    week: 9,
    phase: "传统算法",
    filter: "classic",
    title: "传统单通道降噪",
    summary: "复现谱减法、Wiener、MMSE-STSA、OM-LSA、噪声估计、musical noise 抑制和后处理。",
    tags: ["Wiener", "MMSE", "OM-LSA", "noise PSD"],
    tasks: ["实现谱减法/Wiener 两个 baseline", "用非平稳噪声测试噪声估计迟滞", "整理 musical noise 的听感样例"]
  },
  {
    week: 10,
    phase: "传统算法",
    filter: "classic",
    title: "自适应滤波器",
    summary: "学习 LMS、NLMS、AP、RLS、步长控制、泄漏项、稀疏回声路径、收敛速度与稳定性。",
    tags: ["LMS", "NLMS", "AP", "RLS"],
    tasks: ["用 NLMS 识别随机 FIR 系统", "画 step size 对收敛和 misalignment 的影响", "解释 double-talk 为什么会让滤波器发散"]
  },
  {
    week: 11,
    phase: "AEC",
    filter: "classic",
    title: "声学回声消除核心链路",
    summary: "把延迟估计、分块频域自适应滤波、DTD、NLP、残余回声抑制、舒适噪声和非线性处理串起来。",
    tags: ["AEC", "FDAF", "DTD", "RES"],
    tasks: ["实现 block FDAF AEC 原型", "用 ERLE/near-end distortion 评估双讲", "构造回声路径突变和时钟漂移样例"]
  },
  {
    week: 12,
    phase: "AEC",
    filter: "classic",
    title: "阅读 WebRTC AEC3 与 SpeexDSP",
    summary: "按模块拆读工业实现：delay controller、subtractor、echo remover、comfort noise、config 与调参策略。",
    tags: ["WebRTC", "SpeexDSP", "AEC3", "production"],
    tasks: ["画 WebRTC AEC3 模块图", "对比 SpeexDSP MDF 与自己的 FDAF", "整理 10 个 AEC 线上问题排查脚本"]
  },
  {
    week: 13,
    phase: "阵列",
    filter: "classic",
    title: "麦克风阵列与 TDOA",
    summary: "学习阵列流形、近场/远场、空间混叠、阵列标定、GCC-PHAT、TDOA 几何解和多源困难。",
    tags: ["array", "TDOA", "GCC-PHAT", "aliasing"],
    tasks: ["模拟 2/4/6 麦阵列接收信号", "用 GCC-PHAT 估计延迟并画峰值置信度", "计算不同麦距的空间混叠频率"]
  },
  {
    week: 14,
    phase: "阵列",
    filter: "classic",
    title: "声源定位：SRP-PHAT、MUSIC、ESPRIT",
    summary: "补齐经典 DOA 算法、协方差矩阵、特征分解、空间谱搜索、宽带处理和多声源分辨率。",
    tags: ["DOA", "SRP-PHAT", "MUSIC", "ESPRIT"],
    tasks: ["用 Pyroomacoustics 复现 SRP/MUSIC", "比较混响和 SNR 对定位的影响", "输出角度误差 CDF"]
  },
  {
    week: 15,
    phase: "阵列",
    filter: "classic",
    title: "波束形成与多波束",
    summary: "学习 delay-and-sum、MVDR、LCMV、GEV、mask-based beamforming、多波束扫描和后滤波。",
    tags: ["beamforming", "MVDR", "LCMV", "GEV"],
    tasks: ["实现 DS 与 MVDR beamformer", "做 360 度多波束能量图", "分析阵列误差对 null depth 的影响"]
  },
  {
    week: 16,
    phase: "阵列",
    filter: "product",
    title: "AEC、波束与产品链路耦合",
    summary: "理解先 AEC 后 BF、先 BF 后 AEC、多通道 AEC、参考信号选择、非线性扬声器和端侧算力取舍。",
    tags: ["multi-channel AEC", "BF-AEC", "pipeline", "CPU"],
    tasks: ["比较两种 AEC/BF 串联顺序", "写一页会议终端音频链路方案", "建立延迟、CPU、音质三目标权衡表"]
  },
  {
    week: 17,
    phase: "深度学习",
    filter: "deep",
    title: "深度学习语音增强基础",
    summary: "补齐 STFT 复数谱、mask 估计、损失函数、数据增强、流式因果模型和 PyTorch/Torchaudio 数据管线。",
    tags: ["PyTorch", "mask", "complex spectrum", "streaming"],
    tasks: ["训练一个小型 CRN mask 模型", "比较 L1 magnitude、SI-SDR、multi-resolution STFT loss", "做流式 chunk 推理脚本"]
  },
  {
    week: 18,
    phase: "深度学习",
    filter: "deep",
    title: "RNNoise、DCCRN、DPCRN、FullSubNet",
    summary: "学习轻量 RNN、复数卷积、双路径建模、子带/全带融合、低延迟降噪和后处理策略。",
    tags: ["RNNoise", "DCCRN", "DPCRN", "FullSubNet"],
    tasks: ["复现一个公开轻量 DNS baseline", "导出 ONNX 并测实时率 RTF", "整理噪声类型与泛化失败样例"]
  },
  {
    week: 19,
    phase: "深度学习",
    filter: "deep",
    title: "深度 AEC 与残余回声抑制",
    summary: "学习 far-end/near-end/mic 多输入特征、echo mask、双讲保护、神经后滤波和传统 AEC 之后的 RES。",
    tags: ["deep AEC", "RES", "double-talk", "AECMOS"],
    tasks: ["构造 far/mic/clean 三路训练样本", "训练残余回声抑制小模型", "比较纯神经 AEC 与传统 AEC+神经 RES"]
  },
  {
    week: 20,
    phase: "深度学习",
    filter: "product",
    title: "模型压缩、量化与端侧部署",
    summary: "掌握蒸馏、剪枝、INT8/FP16、状态缓存、内存复用、ONNX Runtime、SIMD 与实时调度。",
    tags: ["ONNX", "quantization", "SIMD", "RTF"],
    tasks: ["把 DNS 模型转 ONNX 并跑流式 demo", "测 CPU、内存、延迟和 RTF", "写模型上线风险清单"]
  },
  {
    week: 21,
    phase: "产品链路",
    filter: "product",
    title: "会议音频全链路",
    summary: "串联 HPF、AEC、BF、NS、AGC、DRC、limiter、VAD、CNG、codec、jitter buffer 和 PLC。",
    tags: ["APM", "AGC", "Opus", "PLC"],
    tasks: ["画上行/下行完整信号链", "确定每个模块的输入输出和状态", "写 15 个端到端回归测试场景"]
  },
  {
    week: 22,
    phase: "工程化",
    filter: "product",
    title: "C/C++ 实时实现与性能优化",
    summary: "练习内存对齐、SIMD、定点、cache、线程优先级、音频回调禁忌、日志限流和崩溃可诊断性。",
    tags: ["C++", "SIMD", "callback", "profiling"],
    tasks: ["把一个滤波或 STFT 模块移植到 C++", "写单元测试和性能 benchmark", "用 profiler 找到 3 个热点"]
  },
  {
    week: 23,
    phase: "评测体系",
    filter: "product",
    title: "数据集、回归测试与听测平台",
    summary: "建立场景覆盖、噪声库、房间库、回声路径库、指标聚合、版本对比和人工听测流程。",
    tags: ["dataset", "regression", "listening test", "dashboard"],
    tasks: ["生成 1000 条合成回归样例", "做版本 A/B 指标 dashboard", "为失败样例标注根因"]
  },
  {
    week: 24,
    phase: "Capstone",
    filter: "product",
    title: "4 麦会议音频 Capstone",
    summary: "完成一个可演示的会议上行链路：延迟估计、AEC、DOA、多波束、降噪、AGC、指标报告和调参文档。",
    tags: ["capstone", "4-mic", "demo", "report"],
    tasks: ["提交端到端 demo 与 10 条音频对比", "输出每个模块的指标和 CPU 占用", "做一份线上问题排查手册"]
  }
];

const modules = [
  {
    code: "DSP",
    filter: "foundation",
    title: "数字信号处理",
    summary: "采样、卷积、FFT/STFT、滤波器、多速率、随机信号、谱估计、定点和实时缓冲。",
    points: ["每个算法都能回到频域/时域解释", "会手写最小可运行版本", "知道延迟、窗长、数值稳定性的代价"]
  },
  {
    code: "AC",
    filter: "foundation",
    title: "声学与语音",
    summary: "语音产生、听觉感知、房间声学、RIR、混响、设备声学、麦克风与扬声器非理想性。",
    points: ["能判断问题来自算法、声学结构还是硬件", "会构造接近真实会议室的数据", "理解听感指标与客观指标的错位"]
  },
  {
    code: "AEC",
    filter: "classic",
    title: "回声消除",
    summary: "延迟估计、自适应滤波、频域分块、双讲检测、残余回声抑制、非线性处理与 WebRTC AEC3。",
    points: ["会用 ERLE 和双讲失真一起评估", "能解释滤波器发散和收敛慢的原因", "知道传统 AEC 与深度 RES 如何配合"]
  },
  {
    code: "NS",
    filter: "classic",
    title: "传统降噪",
    summary: "噪声估计、谱减、Wiener、MMSE-STSA、OM-LSA、VAD、音乐噪声和后滤波。",
    points: ["能定位 musical noise、吞字、残留噪声", "会针对平稳/非平稳噪声选策略", "懂增益平滑和语音保护"]
  },
  {
    code: "ARR",
    filter: "classic",
    title: "阵列与定位",
    summary: "阵列几何、TDOA、GCC-PHAT、SRP-PHAT、MUSIC、ESPRIT、远近场、多源与空间混叠。",
    points: ["能从麦距推导混叠频率", "会输出 DOA 误差 CDF", "知道混响和阵列误差如何破坏定位"]
  },
  {
    code: "BF",
    filter: "classic",
    title: "波束形成",
    summary: "Delay-and-sum、MVDR、LCMV、GEV、多波束扫描、mask-based beamforming 与后滤波。",
    points: ["能画出主瓣、旁瓣和 null", "会处理协方差估计和对角加载", "知道 BF 与 AEC 的耦合顺序"]
  },
  {
    code: "DL",
    filter: "deep",
    title: "深度语音增强",
    summary: "CRN/RNN/Transformer、复数谱、mask、DNS、深度 AEC、数据增强、损失函数和流式因果推理。",
    points: ["能训练小模型并解释失败样例", "会做低延迟 chunk 推理", "知道模型泛化依赖数据分布"]
  },
  {
    code: "ENG",
    filter: "product",
    title: "量产工程",
    summary: "C/C++ 实时实现、SIMD、ONNX、量化、日志、回归测试、主客观评测和线上排障。",
    points: ["会把算法写成稳定模块接口", "能测 CPU、内存、延迟和 RTF", "能建立可复现的音频回归系统"]
  },
  {
    code: "RTC",
    filter: "product",
    title: "实时通信",
    summary: "WebRTC APM、Opus、AGC、DRC、VAD、CNG、jitter buffer、PLC、上下行链路与弱网音频体验。",
    points: ["知道会议产品不是单点算法", "能解释端到端延迟和同步", "会把音质问题拆成链路问题"]
  }
];

const projects = [
  {
    phase: "P0",
    filter: "foundation",
    title: "音频实验台 audio_lab",
    summary: "WAV/PCM 读写、重采样、滤波、STFT、谱图、指标、批处理报告，后续项目全部复用。",
    deliverables: ["CLI: inspect/filter/stft/metric/report", "一组干净语音、噪声、回声样例", "实验日志模板"],
    code: "audio_lab inspect sample.wav\n audio_lab stft --win 20 --hop 10"
  },
  {
    phase: "P1",
    filter: "classic",
    title: "传统降噪对比台",
    summary: "实现谱减、Wiener、MMSE baseline，比较不同噪声、SNR、窗长和平滑参数下的听感。",
    deliverables: ["噪声估计曲线", "语音失真/残留噪声标注", "指标与听感不一致样例"],
    code: "audio_lab denoise --algo wiener\n audio_lab report dns_cases/"
  },
  {
    phase: "P2",
    filter: "classic",
    title: "NLMS/FDAF 回声消除实验",
    summary: "从自适应滤波开始，做到频域分块 AEC、延迟估计、双讲保护和残余回声抑制。",
    deliverables: ["ERLE 曲线", "双讲样例", "回声路径突变测试"],
    code: "audio_lab aec --far far.wav --mic mic.wav\n audio_lab erle out.wav"
  },
  {
    phase: "P3",
    filter: "classic",
    title: "4 麦阵列定位与多波束",
    summary: "用仿真和真实录音验证 GCC-PHAT、SRP-PHAT、MUSIC、DS/MVDR 与多波束扫描。",
    deliverables: ["DOA 误差 CDF", "360 度空间谱", "波束图和 null 深度"],
    code: "audio_lab doa --array circular4\n audio_lab beam --method mvdr"
  },
  {
    phase: "P4",
    filter: "deep",
    title: "低延迟深度降噪",
    summary: "训练小型 CRN/RNN 模型，导出 ONNX，完成流式推理、RTF 测试和失败样例复盘。",
    deliverables: ["训练配置和数据混合脚本", "ONNX 流式 demo", "CPU/内存/延迟表"],
    code: "python train_dns.py --causal\n python export_onnx.py"
  },
  {
    phase: "P5",
    filter: "product",
    title: "会议上行链路 Capstone",
    summary: "把 AEC、DOA、BF、NS、AGC 和评测报告串成一条可演示链路，形成你的入职作品集。",
    deliverables: ["端到端 demo", "10 条音频 A/B 对比", "排障手册和调参手册"],
    code: "audio_lab pipeline --profile meeting4mic\n audio_lab compare v1 v2"
  }
];

const resources = [
  {
    type: "课程",
    filter: "foundation",
    title: "MIT OCW Digital Signal Processing",
    url: "https://ocw.mit.edu/courses/res-6-008-digital-signal-processing-spring-2011/",
    summary: "Oppenheim 体系的 DSP 主线，适合补 FFT、滤波器和多速率的理论根基。"
  },
  {
    type: "课程",
    filter: "foundation",
    title: "MIT OCW Signals and Systems",
    url: "https://ocw.mit.edu/courses/res-6-007-signals-and-systems-spring-2011/",
    summary: "信号与系统底座，建议和 DSP 并行查漏补缺。"
  },
  {
    type: "教材",
    filter: "foundation",
    title: "Spectral Audio Signal Processing",
    url: "https://ccrma.stanford.edu/~jos/sasp/",
    summary: "Julius O. Smith 的频谱音频处理在线书，适合深入窗函数、滤波、谱分析和声学建模。"
  },
  {
    type: "源码",
    filter: "classic",
    title: "WebRTC AEC3 Source",
    url: "https://webrtc.googlesource.com/src/+/refs/heads/main/modules/audio_processing/aec3/",
    summary: "工业级实时 AEC 参考实现，重点看 delay、subtractor、echo remover、config。"
  },
  {
    type: "文档",
    filter: "classic",
    title: "SpeexDSP Manual",
    url: "https://www.speex.org/docs/manual/speex-manual/",
    summary: "轻量语音处理库，包含 MDF AEC、preprocessor、jitter buffer 等传统实时链路组件。"
  },
  {
    type: "代码",
    filter: "deep",
    title: "RNNoise",
    url: "https://github.com/xiph/rnnoise",
    summary: "轻量 RNN 降噪经典项目，适合理解低算力实时深度降噪。"
  },
  {
    type: "挑战",
    filter: "deep",
    title: "Microsoft DNS Challenge",
    url: "https://github.com/microsoft/DNS-Challenge",
    summary: "深度降噪常用数据、baseline、评测思路入口。"
  },
  {
    type: "挑战",
    filter: "deep",
    title: "Microsoft AEC Challenge",
    url: "https://github.com/microsoft/AEC-Challenge",
    summary: "深度/混合 AEC 数据与评测入口，适合做第 19 周项目参考。"
  },
  {
    type: "文档",
    filter: "classic",
    title: "Pyroomacoustics DOA",
    url: "https://pyroomacoustics.readthedocs.io/en/pypi-release/pyroomacoustics.doa.html",
    summary: "阵列仿真、DOA、波束形成实验的高效工具。"
  },
  {
    type: "教程",
    filter: "classic",
    title: "PySDR Direction Finding",
    url: "https://pysdr.org/content/doa.html",
    summary: "阵列流形、波束扫描、MUSIC 的可视化讲解，适合快速建立直觉。"
  },
  {
    type: "标准",
    filter: "product",
    title: "ITU-T P.835",
    url: "https://www.itu.int/rec/T-REC-P.835",
    summary: "语音增强主观评测方法，区分 speech、noise、overall 三个维度。"
  },
  {
    type: "标准",
    filter: "product",
    title: "ITU-T P.808",
    url: "https://www.itu.int/rec/T-REC-P.808",
    summary: "众包主观语音质量评测建议，适合搭建大规模听测流程。"
  }
];

const reviews = [
  {
    filter: "foundation",
    title: "DSP 白板题",
    summary: "不用查资料，能把以下主题讲清并写出核心公式。",
    items: ["STFT 为什么要 overlap-add", "FIR/IIR 稳定性和群延迟", "GCC-PHAT 为什么做相位归一化", "dBFS、SNR、ERLE 的定义差异"]
  },
  {
    filter: "classic",
    title: "AEC 排障能力",
    summary: "给你 far/mic/out 三路音频，能快速判断问题根因。",
    items: ["延迟估计错位", "双讲发散", "回声路径突变", "非线性残余回声", "时钟漂移"]
  },
  {
    filter: "classic",
    title: "阵列算法验收",
    summary: "给你阵列几何和多通道录音，能定位、画谱、解释误差。",
    items: ["TDOA 到角度的几何关系", "SRP-PHAT 与 MUSIC 的适用条件", "MVDR 协方差估计和 diagonal loading", "空间混叠频率"]
  },
  {
    filter: "deep",
    title: "深度降噪验收",
    summary: "能训练、部署、解释一个低延迟增强模型。",
    items: ["因果模型延迟怎么算", "训练集混合策略", "损失函数与听感关系", "ONNX 导出和流式状态缓存"]
  },
  {
    filter: "product",
    title: "产品链路验收",
    summary: "能从用户反馈拆到模块、数据、指标和可复现测试。",
    items: ["吞字、断续、金属音、残响、啸叫的排查路径", "AGC/NS/AEC/BF 的相互影响", "CPU 超限后的降级策略", "版本回归听测流程"]
  },
  {
    filter: "product",
    title: "沟通表达验收",
    summary: "能把复杂算法转成团队能执行的方案。",
    items: ["一页方案说明目标、约束、风险", "用 A/B 样例解释优化收益", "把问题拆成短周期实验", "沉淀参数、场景和结论"]
  }
];

const state = {
  tab: "path",
  filter: "all",
  query: "",
  progress: JSON.parse(localStorage.getItem("audioPlanProgress") || "{}")
};

const $ = (selector) => document.querySelector(selector);

function normalize(text) {
  return text.toLowerCase().trim();
}

function getLesson(weekNumber) {
  return window.lessonDetails?.[weekNumber];
}

function getLessonExtra(weekNumber) {
  return window.lessonExtras?.[weekNumber];
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function refreshIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function matches(item) {
  const filterOk = state.filter === "all" || item.filter === state.filter;
  const lesson = item.week ? getLesson(item.week) : null;
  const text = normalize([
    item.title,
    item.summary,
    item.phase,
    item.tags?.join(" "),
    item.tasks?.join(" "),
    item.points?.join(" "),
    item.items?.join(" "),
    item.type,
    lesson?.subtitle,
    lesson?.objective,
    lesson?.mentalModel,
    lesson?.sections?.map((section) => [section.title, section.items.join(" ")].join(" ")).join(" "),
    lesson?.formulas?.join(" "),
    lesson?.lab?.steps?.join(" "),
    lesson?.pitfalls?.join(" "),
    lesson?.questions?.join(" "),
    item.week ? getLessonExtra(item.week)?.plain : "",
    item.week ? getLessonExtra(item.week)?.memory?.join(" ") : "",
    item.week ? getLessonExtra(item.week)?.diagram?.title : ""
  ].filter(Boolean).join(" "));
  const queryOk = !state.query || text.includes(normalize(state.query));
  return filterOk && queryOk;
}

function saveProgress() {
  localStorage.setItem("audioPlanProgress", JSON.stringify(state.progress));
}

function taskId(week, index) {
  return `week-${week}-task-${index}`;
}

function renderTimeline() {
  const timeline = $("#timeline");
  timeline.innerHTML = "";
  let visible = 0;

  plan.forEach((week) => {
    const article = document.createElement("article");
    article.className = `week${matches(week) ? "" : " hidden"}`;
    if (matches(week)) visible += 1;
    article.innerHTML = `
      <div class="week-index">W${week.week}</div>
      <div class="week-body">
        <p class="eyebrow">${week.phase}</p>
        <h3>${week.title}</h3>
        <p>${week.summary}</p>
        <div class="tag-row">${week.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}</div>
        <button class="lesson-button" data-lesson="${week.week}" type="button">
          <i data-lucide="book-open-check" aria-hidden="true"></i>
          <span>打开讲义</span>
        </button>
      </div>
      <div class="task-box">
        ${week.tasks.map((task, index) => {
          const id = taskId(week.week, index);
          return `
            <label class="task">
              <input type="checkbox" data-task="${id}" ${state.progress[id] ? "checked" : ""} />
              <span>${task}</span>
            </label>
          `;
        }).join("")}
      </div>
    `;
    timeline.appendChild(article);
  });

  if (!visible) {
    timeline.innerHTML = `<div class="empty-state">没有匹配的周计划。</div>`;
  }

  timeline.querySelectorAll("input[type='checkbox']").forEach((input) => {
    input.addEventListener("change", (event) => {
      state.progress[event.target.dataset.task] = event.target.checked;
      saveProgress();
      updateStats();
    });
  });

  timeline.querySelectorAll("[data-lesson]").forEach((button) => {
    button.addEventListener("click", () => openLesson(Number(button.dataset.lesson)));
  });
}

function renderModules() {
  const container = $("#knowledgeMap");
  container.innerHTML = "";
  let visible = 0;

  modules.forEach((module) => {
    const article = document.createElement("article");
    article.className = `module-card${matches(module) ? "" : " hidden"}`;
    if (matches(module)) visible += 1;
    article.innerHTML = `
      <div class="module-top">
        <h3>${module.title}</h3>
        <div class="module-badge">${module.code}</div>
      </div>
      <p>${module.summary}</p>
      <ul>${module.points.map((point) => `<li>${point}</li>`).join("")}</ul>
    `;
    container.appendChild(article);
  });

  if (!visible) {
    container.innerHTML = `<div class="empty-state">没有匹配的知识模块。</div>`;
  }
}

function renderProjects() {
  const container = $("#projectList");
  container.innerHTML = "";
  let visible = 0;

  projects.forEach((project) => {
    const article = document.createElement("article");
    article.className = `project${matches(project) ? "" : " hidden"}`;
    if (matches(project)) visible += 1;
    article.innerHTML = `
      <div>
        <div class="project-phase">${project.phase}</div>
        <h3>${project.title}</h3>
      </div>
      <div>
        <p>${project.summary}</p>
        <ul>${project.deliverables.map((item) => `<li>${item}</li>`).join("")}</ul>
      </div>
      <pre class="project-code">${project.code}</pre>
    `;
    container.appendChild(article);
  });

  if (!visible) {
    container.innerHTML = `<div class="empty-state">没有匹配的项目。</div>`;
  }
}

function renderResources() {
  const container = $("#resourceList");
  container.innerHTML = "";
  let visible = 0;

  resources.forEach((resource) => {
    const article = document.createElement("article");
    article.className = `resource${matches(resource) ? "" : " hidden"}`;
    if (matches(resource)) visible += 1;
    article.innerHTML = `
      <div class="resource-type">${resource.type}</div>
      <div>
        <a href="${resource.url}" target="_blank" rel="noreferrer">${resource.title}</a>
        <p>${resource.summary}</p>
      </div>
    `;
    container.appendChild(article);
  });

  if (!visible) {
    container.innerHTML = `<div class="empty-state">没有匹配的资料。</div>`;
  }
}

function renderReviews() {
  const container = $("#reviewList");
  container.innerHTML = "";
  let visible = 0;

  reviews.forEach((review) => {
    const article = document.createElement("article");
    article.className = `check-card${matches(review) ? "" : " hidden"}`;
    if (matches(review)) visible += 1;
    article.innerHTML = `
      <h3>${review.title}</h3>
      <p>${review.summary}</p>
      <ul>${review.items.map((item) => `<li>${item}</li>`).join("")}</ul>
    `;
    container.appendChild(article);
  });

  if (!visible) {
    container.innerHTML = `<div class="empty-state">没有匹配的验收项。</div>`;
  }
}

function renderBulletList(items, className = "") {
  return `<ul class="${className}">${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

function renderLessonResources(resources = []) {
  if (!resources.length) {
    return "";
  }

  return `
    <section class="lesson-block">
      <h3>资料入口</h3>
      <div class="lesson-resources">
        ${resources.map((resource) => `
          <a class="lesson-resource" href="${escapeHtml(resource.url)}" target="_blank" rel="noreferrer">
            <span>${escapeHtml(resource.label)}</span>
            <small>${escapeHtml(resource.note)}</small>
          </a>
        `).join("")}
      </div>
    </section>
  `;
}

function svgText(text, x, y, options = {}) {
  const size = options.size || 15;
  const weight = options.weight || 700;
  const anchor = options.anchor || "middle";
  return `<text x="${x}" y="${y}" text-anchor="${anchor}" dominant-baseline="middle" font-size="${size}" font-weight="${weight}" fill="${options.fill || "#18201c"}">${escapeHtml(text)}</text>`;
}

function renderFlowSvg(diagram) {
  const nodes = diagram.nodes || [];
  const count = nodes.length;
  const gap = count > 1 ? 660 / (count - 1) : 0;
  const parts = nodes.map((node, index) => {
    const x = 70 + gap * index;
    const fill = index % 2 === 0 ? "#eef8f2" : "#fff7e2";
    const arrow = index < count - 1 ? `<path d="M ${x + 52} 110 L ${x + gap - 52} 110" stroke="#8aa099" stroke-width="2" marker-end="url(#arrow)" />` : "";
    return `
      ${arrow}
      <rect x="${x - 52}" y="78" width="104" height="64" rx="8" fill="${fill}" stroke="#cfdad2" />
      ${svgText(node, x, 110, { size: 14 })}
    `;
  }).join("");

  return `
    <svg viewBox="0 0 800 220" role="img" aria-label="${escapeHtml(diagram.title)}">
      <defs>
        <marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
          <path d="M0,0 L0,6 L9,3 z" fill="#8aa099"></path>
        </marker>
      </defs>
      ${svgText(diagram.title, 400, 34, { size: 18 })}
      ${parts}
    </svg>
  `;
}

function renderLoopSvg(diagram) {
  const nodes = diagram.nodes || [];
  const positions = [
    [400, 58],
    [610, 128],
    [400, 190],
    [190, 128]
  ];
  const parts = nodes.map((node, index) => {
    const [x, y] = positions[index % positions.length];
    return `
      <rect x="${x - 62}" y="${y - 26}" width="124" height="52" rx="8" fill="#eef8f2" stroke="#cfdad2" />
      ${svgText(node, x, y, { size: 14 })}
    `;
  }).join("");

  return `
    <svg viewBox="0 0 800 250" role="img" aria-label="${escapeHtml(diagram.title)}">
      <defs>
        <marker id="arrow-loop" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
          <path d="M0,0 L0,6 L9,3 z" fill="#8aa099"></path>
        </marker>
      </defs>
      ${svgText(diagram.title, 400, 28, { size: 18 })}
      <path d="M 468 62 C 590 60 660 92 650 124" fill="none" stroke="#8aa099" stroke-width="2" marker-end="url(#arrow-loop)" />
      <path d="M 610 158 C 590 210 500 226 438 204" fill="none" stroke="#8aa099" stroke-width="2" marker-end="url(#arrow-loop)" />
      <path d="M 332 190 C 210 190 140 160 150 128" fill="none" stroke="#8aa099" stroke-width="2" marker-end="url(#arrow-loop)" />
      <path d="M 190 98 C 220 48 302 36 360 50" fill="none" stroke="#8aa099" stroke-width="2" marker-end="url(#arrow-loop)" />
      ${parts}
    </svg>
  `;
}

function renderSpectrumSvg(diagram) {
  const labels = diagram.labels || [];
  return `
    <svg viewBox="0 0 800 250" role="img" aria-label="${escapeHtml(diagram.title)}">
      ${svgText(diagram.title, 400, 28, { size: 18 })}
      <line x1="86" y1="194" x2="720" y2="194" stroke="#9bad9f" stroke-width="2" />
      <line x1="86" y1="194" x2="86" y2="56" stroke="#9bad9f" stroke-width="2" />
      <path d="M 100 176 C 160 76 212 82 260 152 C 310 216 366 102 420 138 C 486 182 532 78 594 98 C 650 116 682 144 708 84" fill="none" stroke="#0d7c75" stroke-width="4" />
      <path d="M 130 66 L 130 194 M 238 66 L 238 194 M 346 66 L 346 194 M 454 66 L 454 194 M 562 66 L 562 194" stroke="#dbe2dc" stroke-width="2" />
      ${labels.map((label, index) => svgText(label, 170 + index * 150, 220, { size: 13, fill: "#627067" })).join("")}
    </svg>
  `;
}

function renderFilterSvg(diagram) {
  return `
    <svg viewBox="0 0 800 250" role="img" aria-label="${escapeHtml(diagram.title)}">
      ${svgText(diagram.title, 400, 28, { size: 18 })}
      <line x1="88" y1="192" x2="710" y2="192" stroke="#9bad9f" stroke-width="2" />
      <line x1="88" y1="192" x2="88" y2="62" stroke="#9bad9f" stroke-width="2" />
      <path d="M 100 176 L 210 176 C 250 176 248 82 292 82 L 490 82 C 540 82 532 174 582 174 L 700 174" fill="none" stroke="#0d7c75" stroke-width="5" />
      <rect x="280" y="54" width="220" height="54" rx="8" fill="#eef8f2" stroke="#cfdad2" />
      ${svgText("通带", 390, 81, { size: 15 })}
      ${svgText("频率", 720, 208, { size: 13, fill: "#627067" })}
      ${svgText("增益", 66, 58, { size: 13, fill: "#627067" })}
      ${svgText("阻带", 160, 154, { size: 13, fill: "#627067" })}
      ${svgText("阻带", 642, 154, { size: 13, fill: "#627067" })}
    </svg>
  `;
}

function renderArraySvg(diagram) {
  return `
    <svg viewBox="0 0 800 250" role="img" aria-label="${escapeHtml(diagram.title)}">
      ${svgText(diagram.title, 400, 28, { size: 18 })}
      <path d="M 110 62 C 232 98 300 122 388 154" fill="none" stroke="#d95b43" stroke-width="3" stroke-dasharray="8 8" />
      <path d="M 100 92 C 226 120 302 146 386 182" fill="none" stroke="#d95b43" stroke-width="2" stroke-dasharray="8 8" opacity="0.65" />
      <circle cx="420" cy="152" r="18" fill="#0d7c75" />
      <circle cx="510" cy="152" r="18" fill="#0d7c75" />
      <circle cx="600" cy="152" r="18" fill="#0d7c75" />
      <line x1="420" y1="194" x2="510" y2="194" stroke="#9bad9f" stroke-width="2" />
      <line x1="510" y1="194" x2="600" y2="194" stroke="#9bad9f" stroke-width="2" />
      ${svgText("source", 132, 48, { size: 14, fill: "#d95b43" })}
      ${svgText("mic1", 420, 126, { size: 13, fill: "#075a55" })}
      ${svgText("mic2", 510, 126, { size: 13, fill: "#075a55" })}
      ${svgText("TDOA", 510, 218, { size: 14, fill: "#627067" })}
    </svg>
  `;
}

function renderPolarSvg(diagram) {
  return `
    <svg viewBox="0 0 800 250" role="img" aria-label="${escapeHtml(diagram.title)}">
      ${svgText(diagram.title, 400, 28, { size: 18 })}
      <circle cx="400" cy="138" r="90" fill="#fbfcfa" stroke="#dbe2dc" />
      <circle cx="400" cy="138" r="58" fill="none" stroke="#dbe2dc" />
      <circle cx="400" cy="138" r="26" fill="none" stroke="#dbe2dc" />
      <path d="M 400 138 L 520 76" stroke="#d95b43" stroke-width="5" marker-end="url(#arrow-polar)" />
      <path d="M 400 138 C 462 104 500 96 548 110" fill="none" stroke="#0d7c75" stroke-width="5" />
      <defs>
        <marker id="arrow-polar" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
          <path d="M0,0 L0,6 L9,3 z" fill="#d95b43"></path>
        </marker>
      </defs>
      ${svgText("峰值方向", 575, 80, { size: 14, fill: "#d95b43" })}
      ${svgText("空间谱", 535, 128, { size: 14, fill: "#075a55" })}
    </svg>
  `;
}

function renderBeamSvg(diagram) {
  return `
    <svg viewBox="0 0 800 250" role="img" aria-label="${escapeHtml(diagram.title)}">
      ${svgText(diagram.title, 400, 28, { size: 18 })}
      <path d="M 410 190 C 362 160 322 112 284 58 C 380 88 460 88 556 58 C 520 112 474 160 410 190 Z" fill="#eef8f2" stroke="#0d7c75" stroke-width="3" />
      <path d="M 410 190 C 350 184 300 194 252 218" fill="none" stroke="#d95b43" stroke-width="3" />
      <path d="M 410 190 C 472 184 524 194 572 218" fill="none" stroke="#d95b43" stroke-width="3" />
      <circle cx="410" cy="190" r="16" fill="#18201c" />
      ${svgText("主瓣", 410, 86, { size: 15, fill: "#075a55" })}
      ${svgText("旁瓣", 246, 224, { size: 13, fill: "#d95b43" })}
      ${svgText("null", 610, 164, { size: 13, fill: "#627067" })}
    </svg>
  `;
}

function renderCompareSvg(diagram) {
  const left = diagram.left || [];
  const right = diagram.right || [];
  return `
    <svg viewBox="0 0 800 250" role="img" aria-label="${escapeHtml(diagram.title)}">
      ${svgText(diagram.title, 400, 28, { size: 18 })}
      <rect x="80" y="62" width="290" height="150" rx="8" fill="#eef8f2" stroke="#cfdad2" />
      <rect x="430" y="62" width="290" height="150" rx="8" fill="#fff7e2" stroke="#eadbb0" />
      ${svgText("方案 A", 225, 88, { size: 16 })}
      ${svgText("方案 B", 575, 88, { size: 16 })}
      ${left.map((item, index) => svgText(item, 225, 122 + index * 34, { size: 14, fill: "#41524a" })).join("")}
      ${right.map((item, index) => svgText(item, 575, 122 + index * 34, { size: 14, fill: "#41524a" })).join("")}
    </svg>
  `;
}

function renderStackSvg(diagram) {
  const nodes = diagram.nodes || [];
  return `
    <svg viewBox="0 0 800 280" role="img" aria-label="${escapeHtml(diagram.title)}">
      ${svgText(diagram.title, 400, 28, { size: 18 })}
      ${nodes.map((node, index) => `
        <rect x="${150 + index * 20}" y="${62 + index * 32}" width="500" height="42" rx="8" fill="${index % 2 ? "#fff7e2" : "#eef8f2"}" stroke="#cfdad2" />
        ${svgText(node, 400 + index * 20, 83 + index * 32, { size: 14 })}
      `).join("")}
    </svg>
  `;
}

function renderSpecialSvg(diagram) {
  const fallback = { ...diagram, type: "flow", nodes: diagram.nodes || diagram.labels || ["输入", "处理", "输出"] };
  if (["score", "mask", "model", "deployment", "performance", "dashboard", "capstone", "speech", "room"].includes(diagram.type)) {
    return renderFlowSvg(fallback);
  }
  return renderFlowSvg(fallback);
}

function renderLessonDiagram(diagram) {
  if (!diagram) {
    return "";
  }

  const renderers = {
    flow: renderFlowSvg,
    spectrum: renderSpectrumSvg,
    filter: renderFilterSvg,
    loop: renderLoopSvg,
    array: renderArraySvg,
    polar: renderPolarSvg,
    beam: renderBeamSvg,
    compare: renderCompareSvg,
    stack: renderStackSvg
  };
  const renderer = renderers[diagram.type] || renderSpecialSvg;

  return `
    <section class="lesson-visual">
      ${renderer(diagram)}
    </section>
  `;
}

function renderLessonMemory(extra) {
  if (!extra) {
    return "";
  }

  return `
    <section class="lesson-memory">
      <div>
        <h3>通俗理解</h3>
        <p>${escapeHtml(extra.plain)}</p>
      </div>
      <div>
        <h3>容易记住</h3>
        ${renderBulletList(extra.memory || [])}
      </div>
    </section>
  `;
}

function ensureLessonDrawer() {
  let overlay = $("#lessonOverlay");
  if (overlay) {
    return overlay;
  }

  document.body.insertAdjacentHTML("beforeend", `
    <div id="lessonOverlay" class="lesson-overlay" aria-hidden="true">
      <div class="lesson-backdrop" data-close-lesson></div>
      <article class="lesson-drawer" role="dialog" aria-modal="true" aria-labelledby="lessonTitle">
        <header class="lesson-header">
          <div>
            <p id="lessonEyebrow" class="eyebrow"></p>
            <h2 id="lessonTitle"></h2>
          </div>
          <button class="icon-button lesson-close" type="button" aria-label="关闭讲义" title="关闭讲义" data-close-lesson>
            <i data-lucide="x" aria-hidden="true"></i>
          </button>
        </header>
        <div id="lessonContent" class="lesson-content"></div>
      </article>
    </div>
  `);

  overlay = $("#lessonOverlay");
  overlay.querySelectorAll("[data-close-lesson]").forEach((target) => {
    target.addEventListener("click", closeLesson);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && overlay.classList.contains("open")) {
      closeLesson();
    }
  });
  return overlay;
}

function openLesson(weekNumber) {
  const week = plan.find((item) => item.week === weekNumber);
  const lesson = getLesson(weekNumber);
  const extra = getLessonExtra(weekNumber);
  if (!week || !lesson) {
    return;
  }

  const overlay = ensureLessonDrawer();
  $("#lessonEyebrow").textContent = `W${week.week} · ${week.phase}`;
  $("#lessonTitle").textContent = lesson.title;
  $("#lessonContent").innerHTML = `
    <div class="lesson-intro">
      <p class="lesson-subtitle">${escapeHtml(lesson.subtitle)}</p>
      <div class="lesson-goals">
        <div>
          <span>学习目标</span>
          <p>${escapeHtml(lesson.objective)}</p>
        </div>
        <div>
          <span>理解模型</span>
          <p>${escapeHtml(lesson.mentalModel)}</p>
        </div>
      </div>
    </div>

    ${renderLessonDiagram(extra?.diagram)}
    ${renderLessonMemory(extra)}

    ${lesson.sections.map((section) => `
      <section class="lesson-block">
        <h3>${escapeHtml(section.title)}</h3>
        ${renderBulletList(section.items)}
      </section>
    `).join("")}

    <section class="lesson-block">
      <h3>关键公式与判断口径</h3>
      ${renderBulletList(lesson.formulas, "formula-list")}
    </section>

    <section class="lesson-block lab-block">
      <h3>${escapeHtml(lesson.lab.title)}</h3>
      ${renderBulletList(lesson.lab.steps)}
      <p class="lesson-output"><strong>产出：</strong>${escapeHtml(lesson.lab.output)}</p>
    </section>

    <section class="lesson-two-col">
      <div class="lesson-block">
        <h3>常见坑</h3>
        ${renderBulletList(lesson.pitfalls)}
      </div>
      <div class="lesson-block">
        <h3>验收问题</h3>
        ${renderBulletList(lesson.questions)}
      </div>
    </section>

    ${renderLessonResources(lesson.resources)}
  `;

  overlay.classList.add("open");
  overlay.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
  history.replaceState(null, "", `#week-${weekNumber}`);
  refreshIcons();
}

function closeLesson() {
  const overlay = $("#lessonOverlay");
  if (!overlay) {
    return;
  }

  overlay.classList.remove("open");
  overlay.setAttribute("aria-hidden", "true");
  document.body.classList.remove("no-scroll");
  if (location.hash.startsWith("#week-")) {
    history.replaceState(null, "", location.pathname + location.search);
  }
}

function updateStats() {
  const total = plan.reduce((sum, week) => sum + week.tasks.length, 0);
  const done = Object.values(state.progress).filter(Boolean).length;
  $("#doneCount").textContent = done;
  $("#totalCount").textContent = total;
}

function switchTab(tabId) {
  state.tab = tabId;
  document.querySelectorAll(".nav-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.tab === tabId);
  });
  document.querySelectorAll(".panel").forEach((panel) => {
    panel.classList.toggle("active", panel.id === tabId);
  });
}

function renderAll() {
  renderTimeline();
  renderModules();
  renderProjects();
  renderResources();
  renderReviews();
  updateStats();
  refreshIcons();
}

function drawSignal() {
  const canvas = $("#signalCanvas");
  const ctx = canvas.getContext("2d");
  const rect = canvas.getBoundingClientRect();
  const scale = window.devicePixelRatio || 1;
  const targetWidth = Math.floor(rect.width * scale);
  const targetHeight = Math.floor(rect.height * scale);
  if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
    canvas.width = targetWidth;
    canvas.height = targetHeight;
  }
  ctx.setTransform(scale, 0, 0, scale, 0, 0);

  const w = rect.width;
  const h = rect.height;
  ctx.clearRect(0, 0, w, h);

  const nodes = [
    { x: 70, y: h * 0.48, label: "Far", color: "#326a9a" },
    { x: w * 0.28, y: h * 0.38, label: "Echo", color: "#d95b43" },
    { x: w * 0.48, y: h * 0.55, label: "Array", color: "#0d7c75" },
    { x: w * 0.68, y: h * 0.36, label: "Mask", color: "#4d8f5d" },
    { x: w - 78, y: h * 0.50, label: "Out", color: "#e5b949" }
  ];

  ctx.lineWidth = 2;
  for (let i = 0; i < nodes.length - 1; i += 1) {
    const a = nodes[i];
    const b = nodes[i + 1];
    ctx.strokeStyle = "rgba(24, 32, 28, 0.24)";
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    const midX = (a.x + b.x) / 2;
    ctx.bezierCurveTo(midX, a.y - 70, midX, b.y + 70, b.x, b.y);
    ctx.stroke();
  }

  const now = performance.now() / 850;
  for (let lane = 0; lane < 3; lane += 1) {
    ctx.beginPath();
    for (let x = 32; x < w - 32; x += 3) {
      const y = h * (0.68 + lane * 0.06) +
        Math.sin(x * 0.032 + now + lane) * (12 - lane * 2) +
        Math.sin(x * 0.083 - now * 1.3) * 4;
      if (x === 32) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = lane === 0 ? "rgba(13,124,117,0.72)" : lane === 1 ? "rgba(217,91,67,0.5)" : "rgba(50,106,154,0.45)";
    ctx.lineWidth = 1.6;
    ctx.stroke();
  }

  nodes.forEach((node, index) => {
    ctx.fillStyle = node.color;
    ctx.beginPath();
    ctx.arc(node.x, node.y, 25, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "white";
    ctx.font = "700 12px Microsoft YaHei, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(node.label, node.x, node.y);

    ctx.strokeStyle = `rgba(24,32,28,${0.08 + index * 0.02})`;
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(node.x, node.y, 42 + index * 6, 0, Math.PI * 2);
    ctx.stroke();
  });

  requestAnimationFrame(drawSignal);
}

document.querySelectorAll(".nav-button").forEach((button) => {
  button.addEventListener("click", () => switchTab(button.dataset.tab));
});

document.querySelectorAll(".segment").forEach((button) => {
  button.addEventListener("click", () => {
    state.filter = button.dataset.filter;
    document.querySelectorAll(".segment").forEach((segment) => {
      segment.classList.toggle("active", segment === button);
    });
    renderAll();
  });
});

$("#searchInput").addEventListener("input", (event) => {
  state.query = event.target.value;
  renderAll();
});

$("#resetProgress").addEventListener("click", () => {
  state.progress = {};
  saveProgress();
  renderAll();
});

renderAll();
drawSignal();

const initialWeek = Number(location.hash.match(/^#week-(\d+)$/)?.[1]);
if (initialWeek) {
  openLesson(initialWeek);
}
